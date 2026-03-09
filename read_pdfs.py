import PyPDF2
import os

pdf_files = [
    'c:/Users/smsas/artist/artist_hub.drawio.pdf',
    'c:/Users/smsas/artist/Visily-Export.pdf'
]

for file_path in pdf_files:
    try:
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = f'\n--- {os.path.basename(file_path)} ---\n'
            for page_num in range(len(reader.pages)):
                text += f'Page {page_num + 1}:\n' + reader.pages[page_num].extract_text() + '\n'
            print(text)
    except Exception as e:
        print(f'Error reading {file_path}: {e}')
