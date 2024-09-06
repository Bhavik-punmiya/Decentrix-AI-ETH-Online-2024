import os

def extract_text_from_md(md_content):
    """
    Function to extract plain text from Markdown content.
    This will remove Markdown syntax.
    """
    import re
    # Remove Markdown links
    md_content = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', md_content)
    # Remove Markdown headers
    md_content = re.sub(r'#+ ', '', md_content)
    # Remove Markdown formatting symbols (bold, italics, etc.)
    md_content = re.sub(r'[*_~`]', '', md_content)
    return md_content

def process_markdown_files(directory):
    all_text = ""

    # Traverse all files in the given directory
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".md"):
                # Read the Markdown file
                with open(os.path.join(root, file), 'r', encoding='utf-8') as f:
                    md_content = f.read()
                    # Extract text from the Markdown content
                    plain_text = extract_text_from_md(md_content)
                    # Append file content with a header
                    all_text += f"\n\n# {file}:\n\n" + plain_text

    # Write the final content to a .txt file
    # desired_filename.txt - name of the output file
    with open('desired_filename.txt', 'w', encoding='utf-8') as output_file:
        output_file.write(all_text)
    print("Text has been written to 'output.txt'")

# Specify the path to the downloaded folder
# docs - folder where documentation of the project is stored
directory_path = 'docs'  # Replace with your actual path
process_markdown_files(directory_path)
