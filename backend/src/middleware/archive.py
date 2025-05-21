import sys, os, io, zipfile

def zip_to_stdout(folder_path):
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as z:
        base = os.path.abspath(folder_path)
        for root, _, files in os.walk(base):
            for f in files:
                full = os.path.join(root, f)
                rel = os.path.relpath(full, os.path.dirname(base))
                z.write(full, rel)
    sys.stdout.buffer.write(buf.getvalue())

if __name__ == "__main__":
    if len(sys.argv)!=2:
        sys.exit("The only argument should be the path to the folder you want archived, ex: python archive.py /path")
    zip_to_stdout(sys.argv[1])