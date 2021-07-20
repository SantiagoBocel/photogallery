import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource} from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import {Photo} from '../photo'
import { IonicNativePlugin } from '@ionic-native/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: Photo[] = [];
  private PHOTO_STORAGE: string = "photos";
  constructor() { }

  public async addNewToGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    
    this.photos.unshift({
      filepath: "Soon..",
      webviewPath: capturedPhoto.webPath
    });

    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });
  }

  public async loadSaved() {
    // Retrieve cached photo array data
    const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
    this.photos = JSON.parse(photoList.value) || [];
  
    // Display the photo by reading into base64 format
for (let photo of this.photos) {
  // Read each saved photo's data from the Filesystem
  const readFile = await Filesystem.readFile({
      path: photo.filepath,
      directory: Directory.Data
  });

  // Web platform only: Load the photo as base64 data
  photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
}
  }

  public async generateBarCode(Data){
    debugger
    const barcodeScanner = await BarcodeScanner.encode("",Data).then(
      res => {
        alert(res);
      }, error => {
        alert(error);
      }
    );
  }

}
