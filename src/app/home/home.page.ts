
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { forkJoin, Observable, empty, fromEvent, BehaviorSubject } from 'rxjs';
import { NgOpenCVService, OpenCVLoadResult } from 'ng-open-cv';
import { tap, switchMap, filter } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';

declare var cv: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements AfterViewInit, OnInit {
  imageUrl = 'assets/mobil.jpg';
  porcentaje = 0.0;
  public logo: string;
  loaderToShow: any;
  private classifiersLoaded = new BehaviorSubject<boolean>(false);
  classifiersLoaded$ = this.classifiersLoaded.asObservable();
  @ViewChild('fileInput', { static: false })
  fileInput: ElementRef;
  @ViewChild('canvasInput', { static: false })
  canvasInput: ElementRef;
  @ViewChild('canvasOutput', { static: false })
  canvasOutput: ElementRef;

  constructor(private ngOpenCVService: NgOpenCVService, public loadingController: LoadingController) { }

  showLoader() {
    this.loaderToShow = this.loadingController.create({
      message: 'This Loader will Not AutoHide'
    }).then((res) => {
      res.present();
 
      res.onDidDismiss().then((dis) => {
        console.log('Loading dismissed!');
      });
    });
    this.hideLoader();
  }
 
  hideLoader() {
    
      this.loadingController.dismiss();
   
  }




  ngOnInit() {

    this.ngOpenCVService.isReady$
      .pipe(

        filter((result: OpenCVLoadResult) => result.ready),
        switchMap(() => {

          return this.loadClassifiers();
        })
      )
      .subscribe(() => {

        this.classifiersLoaded.next(true);
      });
  }

  ngAfterViewInit(): void {

    this.ngOpenCVService.isReady$
      .pipe(
        filter((result: OpenCVLoadResult) => result.ready),
        tap((result: OpenCVLoadResult) => {
          this.ngOpenCVService.loadImageToHTMLCanvas(this.imageUrl, this.canvasInput.nativeElement).subscribe();
        })
      )
      .subscribe(() => { });
  }

  readDataUrl(event) {
    if (event.target.files.length) {
      const reader = new FileReader();
      const load$ = fromEvent(reader, 'load');
      load$
        .pipe(
          switchMap(() => {
            return this.ngOpenCVService.loadImageToHTMLCanvas(`${reader.result}`, this.canvasInput.nativeElement);
          })
        )
        .subscribe(
          () => { },
          err => {
            console.log('Error loading image', err);
          }
        );
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  loadClassifiers(): Observable<any> {
    return forkJoin(
      this.ngOpenCVService.createFileFromUrl(
        'att.xml',
        `assets/opencv/data/haarcascades/att.xml`
      ),
      this.ngOpenCVService.createFileFromUrl(
        'banana.xml',
        `assets/opencv/data/haarcascades/banana.xml`
      ),
      this.ngOpenCVService.createFileFromUrl(
        'chase.xml',
        `assets/opencv/data/haarcascades/chase.xml`
      ),
      this.ngOpenCVService.createFileFromUrl(
        'cocacola.xml',
        `assets/opencv/data/haarcascades/cocacola.xml`
      ),
      this.ngOpenCVService.createFileFromUrl(
        'macy.xml',
        `assets/opencv/data/haarcascades/macy.xml`
      ),
      this.ngOpenCVService.createFileFromUrl(
        'mobil.xml',
        `assets/opencv/data/haarcascades/mobil.xml`
      ),
      this.ngOpenCVService.createFileFromUrl(
        'nike.xml',
        `assets/opencv/data/haarcascades/nike.xml`
      ),
      this.ngOpenCVService.createFileFromUrl(
        'subway.xml',
        `assets/opencv/data/haarcascades/subway.xml`
      ),
      this.ngOpenCVService.createFileFromUrl(
        'walmart.xml',
        `assets/opencv/data/haarcascades/walmart.xml`
      ),
      this.ngOpenCVService.createFileFromUrl(
        'walmart2.xml',
        `assets/opencv/data/haarcascades/walmart2.xml`
      )
    );
  }

  detectLogo() {

    this.ngOpenCVService.isReady$
      .pipe(
        filter((result: OpenCVLoadResult) => result.ready),
        switchMap(() => {
          return this.classifiersLoaded$;
        }),
        tap(() => {
          this.clearOutputCanvas();
          this.logoDetector();
        })
      )
      .subscribe(() => {
        console.log('Logo detectado');
      });
  }

  clearOutputCanvas() {
    const context = this.canvasOutput.nativeElement.getContext('2d');
    context.clearRect(0, 0, this.canvasOutput.nativeElement.width, this.canvasOutput.nativeElement.height);
  }


  async logoDetector() {
    
    const src = cv.imread(this.canvasInput.nativeElement.id);
    const gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    const att = new cv.RectVector();
    const banana = new cv.RectVector();
    const chase = new cv.RectVector();
    const cocacola = new cv.RectVector();
    const macy = new cv.RectVector();
    const mobil = new cv.RectVector();
    const nike = new cv.RectVector();
    const subway = new cv.RectVector();
    const walmart = new cv.RectVector();
    const walmart2 = new cv.RectVector();

    const attCascade = new cv.CascadeClassifier();
    const bananaCascade = new cv.CascadeClassifier();
    const chaseCascade = new cv.CascadeClassifier();
    const cocacolaCascade = new cv.CascadeClassifier();
    const macyCascade = new cv.CascadeClassifier();
    const mobilCascade = new cv.CascadeClassifier();
    const nikeCascade = new cv.CascadeClassifier();
    const subwayCascade = new cv.CascadeClassifier();
    const walmartCascade = new cv.CascadeClassifier();
    const walmart2Cascade = new cv.CascadeClassifier();

    attCascade.load('att.xml');
    bananaCascade.load('banana.xml');
    chaseCascade.load('chase.xml');
    cocacolaCascade.load('cocacola.xml');
    macyCascade.load('macy.xml');
    mobilCascade.load('mobil.xml');
    nikeCascade.load('nike.xml');
    subwayCascade.load('subway.xml');
    walmartCascade.load('walmart.xml');
    walmart2Cascade.load('walmart2.xml');

    const msize = new cv.Size(0, 0);
     

    mobilCascade.detectMultiScale(gray, mobil, 1.1, 4, 1, msize, msize);
    for (let i = 0; i < mobil.size(); ++i) {
      
      var name = "mobil";
      console.log("Entra al for de mobil");
      const point1 = new cv.Point(mobil.get(i).x, mobil.get(i).y);
      const point2 = new cv.Point(mobil.get(i).x + mobil.get(i).width, mobil.get(i).y + mobil.get(i).height);
      

      cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
      cv.putText(src, name, { x: point1.x, y: point2.y }, cv.FONT_HERSHEY_SIMPLEX, 1.0, [0, 255, 0, 255]);

    }

    macyCascade.detectMultiScale(gray, macy, 1.4, 4, 1, msize, msize);
      for (let i = 0; i < macy.size(); ++i) {
      var name = "macys";
      console.log("Entra al for de macy");
      const point1 = new cv.Point(macy.get(i).x, macy.get(i).y);
      const point2 = new cv.Point(macy.get(i).x + macy.get(i).width, macy.get(i).y + macy.get(i).height);
     
      cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
      cv.putText(src, name, { x: point1.x, y: point2.y }, cv.FONT_HERSHEY_SIMPLEX, 1.0, [255, 0, 0, 255]);
    }
    cocacolaCascade.detectMultiScale(gray, cocacola, 1.3, 4, 0, msize, msize);
    for (let i = 0; i < cocacola.size(); ++i) {
      
      var name = "cocacola";
      console.log("Entra al for de cocacola");
      const point1 = new cv.Point(cocacola.get(i).x, cocacola.get(i).y);
      const point2 = new cv.Point(cocacola.get(i).x + cocacola.get(i).width, cocacola.get(i).y + cocacola.get(i).height);
      if (cocacola.size() > 3) {
        console.log("No")
      } else {
        cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
        cv.putText(src, name, { x: point1.x, y: point2.y }, cv.FONT_HERSHEY_SIMPLEX, 1.0, [0, 255, 0, 255]);
      }

      walmartCascade.detectMultiScale(gray, walmart, 1.1, 4, 1, msize, msize);
      for (let i = 0; i < walmart.size(); ++i) {
        var name = "walmart";
        console.log("Entra al for de walmart");
        const point1 = new cv.Point(walmart.get(i).x, walmart.get(i).y);
        const point2 = new cv.Point(walmart.get(i).x + walmart.get(i).width, walmart.get(i).y + walmart.get(i).height);
        
        cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
        cv.putText(src, name, { x: point1.x, y: point2.y }, cv.FONT_HERSHEY_SIMPLEX, 1.0, [255, 0, 0, 255]);
      }

      attCascade.detectMultiScale(gray, att, 1.1, 4, 1, msize, msize);
      for (let i = 0; i < att.size(); ++i) {
        var name = "att";
        console.log("Entra al for de att");
        const point1 = new cv.Point(att.get(i).x, att.get(i).y);
        const point2 = new cv.Point(att.get(i).x + att.get(i).width, att.get(i).y + att.get(i).height);
        
        cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
        cv.putText(src, name, { x: point1.x, y: point2.y }, cv.FONT_HERSHEY_SIMPLEX, 1.0, [255, 0, 0, 255]);
      }

      chaseCascade.detectMultiScale(gray, chase, 1.05, 4, 1, msize, msize);
      for (let i = 0; i < chase.size(); ++i) {
        var name = "Chase";
        console.log("Entra al for de chase");
        const point1 = new cv.Point(chase.get(i).x, chase.get(i).y);
        const point2 = new cv.Point(chase.get(i).x + chase.get(i).width, chase.get(i).y + chase.get(i).height);
       
        cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
        cv.putText(src, name, { x: point1.x, y: point2.y }, cv.FONT_HERSHEY_SIMPLEX, 1.0, [255, 0, 0, 255]);
      }
      nikeCascade.detectMultiScale(gray, nike, 1.4, 4, 1, msize, msize);
      for (let i = 0; i < nike.size(); ++i) {
        var name = "nike";
        console.log("Entra al for de chase");
        const point1 = new cv.Point(nike.get(i).x, nike.get(i).y);
        const point2 = new cv.Point(nike.get(i).x + nike.get(i).width, nike.get(i).y + nike.get(i).height);
        
        cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
        cv.putText(src, name, { x: point1.x, y: point2.y }, cv.FONT_HERSHEY_SIMPLEX, 1.0, [255, 0, 0, 255]);
      }

      bananaCascade.detectMultiScale(gray, banana, 1.7, 6, 1, msize, msize);
      for (let i = 0; i < banana.size(); ++i) {
        var name = "banana";
        console.log("Entra al for de chase");
        const point1 = new cv.Point(banana.get(i).x, banana.get(i).y);
        const point2 = new cv.Point(banana.get(i).x + banana.get(i).width, banana.get(i).y + banana.get(i).height);
        
        cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
        cv.putText(src, name, { x: point1.x, y: point2.y }, cv.FONT_HERSHEY_SIMPLEX, 1.0, [255, 0, 0, 255]);
      }

      subwayCascade.detectMultiScale(gray, subway, 1.4, 4, 1, msize, msize);
      for (let i = 0; i < subway.size(); ++i) {
        var name = "Subway";
        console.log("Entra al for de chase");
        const point1 = new cv.Point(subway.get(i).x, subway.get(i).y);
        const point2 = new cv.Point(subway.get(i).x + subway.get(i).width, subway.get(i).y + subway.get(i).height);
        
        cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
        cv.putText(src, name, { x: point1.x, y: point2.y }, cv.FONT_HERSHEY_SIMPLEX, 1.0, [255, 0, 0, 255]);
      }

    }

    cv.imshow(this.canvasOutput.nativeElement.id, src);
    src.delete();
    gray.delete();
    console.log("Walmart: " + walmart.size())
    console.log("Cocacola: " + cocacola.size())
    console.log("Macy: " + macy.size())
    console.log("mobil: " + mobil.size())
    console.log("chase: " + chase.size())
    macyCascade.delete();
    mobilCascade.delete();
    attCascade.delete();
    bananaCascade.delete();
    chaseCascade.delete();
    nikeCascade.delete();
    subwayCascade.delete();
    cocacolaCascade.delete();
    walmartCascade.delete();
    walmart.delete();
    cocacola.delete();
    subway.delete();
    nike.delete();
    chase.delete();
    banana.delete();
    att.delete();
    mobil.delete();
    macy.delete();

  };



}

