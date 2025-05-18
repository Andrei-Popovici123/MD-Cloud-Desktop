import shutil
import os
import sys

def zip_folder(folder_path, output_dir):
    folder_path = os.path.abspath(folder_path)
    output_dir = os.path.abspath(output_dir)

    if not os.path.isdir(folder_path):
        sys.exit(f"{folder_path} isn't a folder")

    if not os.path.isdir(output_dir):
        sys.exit(f"{output_dir} isn't a folder")

    base_dir = os.path.basename(folder_path.rstrip(os.sep))
    base_name = os.path.join(output_dir, base_dir)

    archive_path = shutil.make_archive(
        base_name=base_name,
        format="zip",
        root_dir=os.path.dirname(folder_path),
        base_dir=base_dir
    )
    return archive_path

if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit("You need to specify the folder to be archived and the output destination folder")
    folder_to_zip = sys.argv[1]
    output_dir = sys.argv[2]
    out_path = zip_folder(folder_to_zip, output_dir)
    print(out_path)