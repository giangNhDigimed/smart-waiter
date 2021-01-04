import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { ImageCropperModalComponent } from './image-cropper-modal/image-cropper-modal.component';
import { ImageCropperSetting } from './image-cropper-interfaces';

@Component({
  selector: '[image-cropper]',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss'],
})

export class ImageCropperComponent {

  // tslint:disable-next-line:no-input-rename
  @Input('image-cropper') imageUrl: string;
  @Input() maximumFileSize: number;
  @Input() settings: ImageCropperSetting;
  @Output() changed = new EventEmitter();
  @Output() updated = new EventEmitter();

  @Output() oversized = new EventEmitter();

  @ViewChild('cropperModal', {static: true}) public cropperModal: ImageCropperModalComponent;
  @ViewChild('inputFile', {static: true}) inputFile: ElementRef;

  imageBlob: any;

  constructor(
    private sanitizer: DomSanitizer,
  ) { }

  open(input: HTMLInputElement) {
    const inputFile = input.files[0];
    this.changed.emit(inputFile);
    input.value = '';
    if (!inputFile) {
      return;
    }
    this.imageBlob = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(inputFile));
    this.cropperModal.open(this.imageBlob);
  }

  openCropperModal() {
    if (this.imageUrl) {
      this.cropperModal.open(this.imageUrl);
    } else {
      const input = this.inputFile.nativeElement as HTMLInputElement;
      input.click();
    }
  }

  onSaved(data) {
    if (!data) {
      return;
    }
    if (this.maximumFileSize && data.blob.size > this.maximumFileSize * Math.pow(1024, 2)) {
      this.oversized.emit(this.maximumFileSize);
      return;
    }
    if (this.imageBlob) {
      URL.revokeObjectURL(this.imageBlob);
    }
    this.imageBlob = data.blob;
    this.updated.emit(this.imageBlob);
  }

}
