from google.cloud import storage
import os

from dotenv import load_dotenv

load_dotenv()

BUCKET_NAME = os.environ.get("BUCKET_NAME")
SLIDES_NAME = os.environ.get("SLIDE_NAME")

def delete_file_from_gcs(bucket_name, file_name):
    """
    Delete a file from a Google Cloud Storage bucket.

    Args:
        bucket_name (str): Name of the bucket.
        file_name (str): Name of the file to delete (can include folder prefix).

    Returns:
        bool: True if file was deleted, False if file did not exist.
    """
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(file_name)

    if blob.exists():
        blob.delete()
        return True
    else:
        return False
    
def upload_ppt_to_gcs(local_file_path: str) -> str:
    """
    Uploads a PowerPoint file to a Google Cloud Storage bucket and returns a public URL.

    Args:
        local_file_path (str): Path to the local .pptx file.

    Returns:
        str: Public URL of the uploaded file.
    """
    destination_blob_name = local_file_path.split("/")[-1]

    client = storage.Client()
    bucket = client.bucket(BUCKET_NAME)
    blob = bucket.blob(destination_blob_name)
    if blob.exists():
        delete_file_from_gcs(BUCKET_NAME, f"{destination_blob_name}.pptx")

    blob.upload_from_filename(local_file_path)
    blob.make_public()

    return blob.public_url

def get_slides_url():
    client = storage.Client()
    bucket = client.bucket(BUCKET_NAME)
    blob = bucket.blob(f"{SLIDES_NAME}.pptx")
    
    if blob.exists():
        blob.make_public()
        return blob.public_url
    else:
        return None
