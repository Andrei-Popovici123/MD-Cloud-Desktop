import sys, os, io, zipfile
from datetime import datetime

LOG_FILE = os.path.join(os.path.dirname(__file__),'..','..','archive.log')

def log(message):
    timestamp= datetime.now().strftime("[%Y-%m-%d %H:%M:%S]")
    with open(LOG_FILE, "a",encoding='utf-8') as f:
        f.write(timestamp + " " + message + "\n")
def file_to_stdout(file_path):
    try:
        if not os.path.isfile(file_path):
            log(f"Error: File does not exist - {file_path}")
            sys.exit(1)
        
        with open(file_path, 'rb') as f:
            sys.stdout.buffer.write(f.read())
        
        log(f"Successfully sent file {file_path} to stdout")
    except Exception as e:
        log(f"Error sending file to stdout: {str(e)}")

def zip_to_stdout(folder_path):
    try:
        if not os.path.exists(folder_path):
            log(f"Error: Folder does not exist - {folder_path}")
            sys.exit(1)

        buf = io.BytesIO()
        with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as z:
            base = os.path.abspath(folder_path)
            for root, _, files in os.walk(base):
                for f in files:
                    full = os.path.join(root, f)
                    rel = os.path.relpath(full, os.path.dirname(base))
                    z.write(full, rel)
        sys.stdout.buffer.write(buf.getvalue())
        log(f"Succesfully archived {folder_path} and sent to stdout")

    except Exception as e:
        log(f"Error processing folder: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv)!=2:
        sys.exit("The only argument should be the path to the folder you want archived, ex: python archive.py /path")
    path = os.path.abspath(sys.argv[1])
    if os.path.isfile(path):
        file_to_stdout(path)
    elif os.path.isdir(path):
        zip_to_stdout(path)
    else:
        log(f"Error - {path} does not exist")
        sys.exit(1)