import { HttpClient, HttpEventType } from '@angular/common/http';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.sass']
})
export class UploaderComponent implements OnInit {

  constructor(private http: HttpClient) { }

  files: FileList;
  url = 'https://newsletter.wsi.edu.pl/testUploadFile';
  maxSendFiles = 4;
  sendFiles = [];
  interv;

  ngOnInit() {
    this.interv = interval(1000).subscribe(e => {

    });
  }

  ngOnDestroy() {
    clearInterval(this.interv);
  }

  sendFile(file) {
    let formData = new FormData();
    formData.append('file', file);

    this.http.post(this.url, formData, {
      reportProgress: true,
      observe: 'events'
    })
      .subscribe(events => {
        if (events.type === HttpEventType.UploadProgress) {


          //  this.progressValue[i].progress = Math.round(events.loaded / events.total * 100);
          // console.log(this.progressValue[0].filesize);
          // console.log(events.total);

          // console.log(this.progressValue.filter(e => {e.filesize == events.total} ));
          // this.progressValue.filter(e => e.filesize == events.total )[0].progress = Math.round(events.loaded / events.total * 100);
        } else if (events.type === HttpEventType.Response) {
          //       console.log(events.body);
          //          alert('SUCCESS !!');
        }

      });


  }

  bindings(val) {
    this.files = val.srcElement.files;


    for (var i = 0; i < this.files.length; i++) {
      let fileSendCount = this.sendFiles.filter(e => { e.filename == this.files[i].name });
      if (fileSendCount.length == 0) {
        this.sendFiles.push({
          progress: 0,
          status: 0, // 0 do wysłania, 1 wysyłam start, 2 wysyłam, 3 koniec ok, 4 koniec nok
          filesize: 0,
          filename: this.files[i].name
        });
      }

    }


  }


}

