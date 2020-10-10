export class ImageUploader {
  public fileInput: HTMLInputElement;
  public fileCount = 0;
  public totalSize = 0;
  public selectedFiles: Array<Record<string, unknown>> = [];

  public afterBind(): void {
    // bind to change event on the file input
    this.fileInput.addEventListener("change", () => this.fileSelectionChanged());
  }

  public openFilePicker(): void {
    this.clearSelection();

    // file input is hidden because of styling, open it with click()
    this.fileInput.click();
  }

  public async upload(): Promise<void> {
    // put the selected files in FormData
    const formData = new FormData();
    for (let i = 0; i < this.fileInput.files.length; i++) {
      const element = this.fileInput.files[i];
      formData.append("file", element);
    }

    // send formData 👇 over the wire here
    console.log("data to send:");
    console.log(formData);
  }

  public fileSelectionChanged(): void {
    this.populateUI(this.fileInput);
  }

  public returnFileSize(number: number): string {
    // shamelessly borrowed from MDN 💖🙇‍♂️
    if (number < 1024) {
      return number + "bytes";
    } else if (number >= 1024 && number < 1048576) {
      return (number / 1024).toFixed(1) + "KB";
    } else if (number >= 1048576) {
      return (number / 1048576).toFixed(1) + "MB";
    }
  }

  private populateUI(fileInput: HTMLInputElement): void {
    for (let i = 0; i < fileInput.files.length; i++) {
      this.fileCount += 1;
      this.totalSize += fileInput.files[i].size;

      this.selectedFiles.push({
        file: fileInput.files[i],
        name: fileInput.files[i].name,
        size: this.returnFileSize(fileInput.files[i].size),
        url: URL.createObjectURL(fileInput.files[i]),
      });
    }
  }

  private clearSelection(): void {
    this.fileInput.value = "";
    // clear any previously selected files
    this.fileCount = 0;
    this.totalSize = 0;
    this.selectedFiles = [];
  }
}
