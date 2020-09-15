import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class HttpService {

    constructor(private http: HttpClient) { }

    postImage(url: string) {
        const endpoint = 'http://localhost:3000/upload';
        const formData: FormData = new FormData();

        let blobBin = atob(url.split(',')[1]);
        let array = [];
        for (let i = 0; i < blobBin.length; i++) {
            array.push(blobBin.charCodeAt(i));
        }

        let blob = new Blob([new Uint8Array(array)], { type: 'image/png' });

        formData.append('image', blob);

        return this.http
            .post(endpoint, formData, {
                responseType: 'blob', reportProgress: true, observe: "events", headers: new HttpHeaders({
                    'Content-Type': 'application/octet-stream',
                })
            })

    }
}