import { HttpClient, HttpEventType } from '@angular/common/http';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import * as $ from 'jquery';


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


  btSend()
  {
    $('input[name=file]').click()
  }
  ngOnInit() {
    this.interv = interval(100).subscribe(e => {

        let wysylam1 = this.sendFiles.filter(e => e.status == 1).length;
        let wysylam2 = this.sendFiles.filter(e => e.status == 2).length;
        // console.log(this.sendFiles);
        
        if(wysylam2 < this.maxSendFiles  && wysylam1 == 0){
          let wyslij = this.sendFiles.filter(e => e.status == 0);
          if(wyslij.length >0)
          {
            // console.log(wyslij);
            this.sendFile();
          }
        }
    });
  }

  ngOnDestroy() {
    clearInterval(this.interv);
  }

  sendFile() {
    let wyslij = this.sendFiles.filter(e => e.status == 0);
    wyslij[0].status = 1;
    let formData = new FormData();
    formData.append('file', wyslij[0].file);

    this.http.post(this.url+"?rn="+wyslij[0].rand, formData, {
      reportProgress: true,
      observe: 'events'
    })
      .subscribe(events => {
        if (events.type === HttpEventType.UploadProgress) {


          let prc = Math.round(events.loaded / events.total * 100);
          let fileEx = this.sendFiles.filter(e =>  e.filesize == events.total );
          console.log(fileEx);
          if(fileEx.length == 0)
          {
            fileEx = this.sendFiles.filter(e => e.status == 1);
            console.log(fileEx);
            if(fileEx.length == 1)
            {
              fileEx[0].filesize =  events.total;
              fileEx[0].status = 2;
              fileEx[0].progress = prc;
            }
          } else {
            fileEx[0].progress = prc;
          };
        } else if (events.type === HttpEventType.Response) {

          let matches = events.url.match(/[0-9]{1,}$/);
          if(this.sendFiles.filter(e => e.rand == matches[0]))
          {
            let send = this.sendFiles.filter(e => e.rand == matches[0]);
            if(events.status == 200 )
            {
                  send[0].status=3;
                  this.sendFiles =   this.sendFiles.filter(e => e.rand != matches[0])
            }
            else  
            {    
              send[0].status=4;
              send[0].stat = events;
            }
          }
          //          alert('SUCCESS !!');
        }

      });


  }

  bindings(val) {


    for (var i = 0; i < val.srcElement.files.length; i++) {
      let fileSendCount = this.sendFiles.filter(e => { e.filename == val.srcElement.files[i].name });
      if (fileSendCount.length == 0) {
        this.sendFiles.push({
          progress: 0,
          status: 0, // 0 do wysłania, 1 wysyłam start, 2 wysyłam, 3 koniec ok, 4 koniec nok
          filesize: 0,
          rand: parseInt(Math.random()*10000000),
          file: val.srcElement.files[i],
          filename: val.srcElement.files[i].name
        });
      }

    }


  }


}

