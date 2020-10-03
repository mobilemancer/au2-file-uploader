import { EventType } from "./../../../../common/eventType";
import { APIResult } from "./../../../../common/network/apiResult";
import { EventAggregator, IDisposable, IEventAggregator } from "aurelia";
import { DataService, IDataService } from "./../../../../common/network/dataService";
export class ImageUploader {
  public fileInput: HTMLInputElement;

  public fileCount = 0;
  public totalSize = 0;
  public selectedFiles: Array<object> = [];

  public uploadedGallery: object = undefined;

  private eventSubscriptions: IDisposable[] = new Array<IDisposable>();

  constructor(
    @IDataService private readonly dataService: DataService,
    @IEventAggregator private eventAggregator: EventAggregator
  ) {
    this.eventSubscriptions = this.setupEventHandlers();
  }

  private setupEventHandlers(): IDisposable[] {
    const subs = new Array<IDisposable>();

    subs.push(
      this.eventAggregator.subscribe("fileUploadResponse", (gallery: APIResult) =>
        this.galleryUploaded(gallery)
      )
    );
    return subs;
  }

  public afterBind(): void {
    // bind to change event on the file input
    this.fileInput.addEventListener("change", () => this.fileSelectionChanged());
  }

  public afterUnbind(): void {
    this.eventSubscriptions.forEach((e) => e.dispose());
  }

  public openFilePicker(): void {
    this.clearSelection();

    // file input is hidden because of styling, opening it by triggering click()
    this.fileInput.click();
  }

  public async upload(): Promise<void> {
    // put the selected files in FormData and throw them at the server
    const formData = new FormData();
    for (let i = 0; i < this.fileInput.files.length; i++) {
      const element = this.fileInput.files[i];
      formData.append("file", element);
    }

    await this.dataService.uploadFiles(formData);
  }

  public fileSelectionChanged(): void {
    this.populateUI(this.fileInput);
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

  public returnFileSize(number): string {
    if (number < 1024) {
      return number + "bytes";
    } else if (number >= 1024 && number < 1048576) {
      return (number / 1024).toFixed(1) + "KB";
    } else if (number >= 1048576) {
      return (number / 1048576).toFixed(1) + "MB";
    }
  }

  public async newUpload(): Promise<void> {
    this.clearSelection();
    this.uploadedGallery = undefined;
  }

  private async galleryUploaded(galleryResponse: APIResult): Promise<void> {
    console.log(galleryResponse);
    if (galleryResponse.ok) {
      this.uploadedGallery = galleryResponse.data as object;
      console.log(this.uploadedGallery);
    } else {
      this.eventAggregator.publish("uiNotificationError" as EventType, "Failed to create Gallery 😲");
    }
  }

  private clearSelection(): void {
    // clear any previously selected files
    this.fileCount = 0;
    this.totalSize = 0;
    this.selectedFiles = [];
  }

  private fileTypes = [
    "image/apng",
    "image/bmp",
    "image/gif",
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/svg+xml",
    "image/tiff",
    "image/webp",
    "image/x-icon",
  ];

  private validFileType(file): boolean {
    return this.fileTypes.includes(file.type);
  }
}
