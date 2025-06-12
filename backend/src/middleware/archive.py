import sys
import os
import io
import zipfile
import json
import mimetypes
import stat
from datetime import datetime

LOG_FILE = os.path.join(os.path.dirname(__file__), '..', '..', 'archive.log')
MAX_SIZE = 4 * 1024 * 1024

def log(message):
    timestamp = datetime.now().strftime("[%Y-%m-%d %H:%M:%S]")
    with open(LOG_FILE, "a", encoding='utf-8') as f:
        f.write(f"{timestamp} {message}\n")

def validate_path(user_path):
    abs_path = os.path.abspath(user_path)
    
    if not os.path.exists(abs_path):
        raise ValueError(f"Path does not exist: {abs_path}")
    if os.path.islink(abs_path):
        raise ValueError("Symbolic links are not allowed")
    
    if os.path.isfile(abs_path) and os.path.getsize(abs_path) > MAX_SIZE:
        log(f"File exceeds {MAX_SIZE} bytes limit")
        sys.exit(2)
    
    return abs_path
def get_file_metadata_and_stream(name, data, path, kind):
    metadata= {
        "name": name,
        "mimetype": mimetypes.guess_type(name)[0] or "application/octet-stream",
        "size": len(data),
        "lastModified": int(os.path.getmtime(path) * 1000),
        "encoding": "binary",
        "type": kind,
        "origin": os.path.abspath(path)
    }
    sys.stdout.buffer.write((json.dumps(metadata)+"\n\n").encode('utf-8'))
    stream_binary(data)

def stream_binary(data):
    if isinstance(data, io.BytesIO):
        data.seek(0)
        sys.stdout.buffer.write(data.read())
    else:
        sys.stdout.buffer.write(data)

def file_to_stdout(file_path):
    try:
        log(f"Processing file: {file_path}")
        
        with open(file_path, 'rb') as f:
            file_data = f.read()
        get_file_metadata_and_stream( os.path.basename(file_path), file_data, file_path, 'file')

        log(f"Successfully streamed file: {file_path}")

    except Exception as e:
        log(f"Error processing file: {str(e)}")
        sys.exit(1)

def zip_to_stdout(folder_path):
    try:
        log(f"Processing folder: {folder_path}")
        
        total_size = 0
        for root, _, files in os.walk(folder_path):
            for f in files:
                fp = os.path.join(root, f)
                total_size += os.path.getsize(fp)
                if total_size > MAX_SIZE:
                    log(f"Folder exceeds {MAX_SIZE} bytes limit")
                    sys.exit(2)
        
        buf = io.BytesIO()
        with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as z:
            base_path = os.path.abspath(folder_path)
            for root, _, files in os.walk(base_path):
                for file in files:
                    full_path = os.path.join(root, file)
                    rel_path = os.path.relpath(full_path, os.path.dirname(base_path))
                    z.write(full_path, rel_path)
        
        get_file_metadata_and_stream(
            os.path.basename(folder_path) + ".zip",
            buf.getvalue(),
            folder_path,
            "zip"
        )
        log(f"Successfully zipped and streamed folder: {folder_path}")

    except Exception as e:
        log(f"Error processing folder: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        log("Error: Expected exactly one argument (file/folder path)")
        sys.exit(1)
    
    try:
        path = validate_path(sys.argv[1])
        
        if os.path.isfile(path):
            file_to_stdout(path)
        elif os.path.isdir(path):
            zip_to_stdout(path)
        else:
            raise ValueError(f"Path is neither file nor directory: {path}")
            
    except Exception as e:
        log(f"Fatal error: {str(e)}")
        sys.exit(1)