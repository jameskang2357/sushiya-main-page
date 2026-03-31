# Image Directory

This directory is for storing images and PDFs that will be uploaded directly to the S3 bucket at the `/img` path.

## Upload Instructions

Upload your files directly to S3 at: `s3://your-bucket-name/img/`

## Gallery PDFs

Upload PDF files for the gallery section:
- `gallery-1.pdf`
- `gallery-2.pdf`
- `gallery-3.pdf`
- `gallery-4.pdf`
- `gallery-5.pdf`
- `gallery-6.pdf`
- `gallery-7.pdf`
- `gallery-8.pdf`
- `gallery-9.pdf`

The gallery will display the filename without the `.pdf` extension. When clicked, PDFs will open in a modal viewer.

## Required Assets

### Favicon
- **File**: `favicon.ico`
- **Location**: Root directory (not in `/img`)
- **Size**: 16x16, 32x32, or 48x48 pixels
- **Format**: ICO format

### Open Graph Image
- **File**: `og-image.jpg` (or `.png`)
- **Location**: Root directory (not in `/img`)
- **Size**: 1200x630 pixels (recommended)
- **Format**: JPG or PNG
- **Purpose**: Used for social media sharing (Facebook, Twitter, etc.)

## Notes

- This directory is excluded from git and from the CI/CD sync process
- Files must be uploaded directly to S3 bucket at `/img/` path
- After uploading to S3, reference files in HTML as: `/img/your-file-name.pdf`
- Favicon and og-image should be uploaded to the root of the S3 bucket, not in `/img/`
