import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { FirebaseServiceProvider } from './providers/firebase-service/firebase-service';

import { AngularFireDatabaseModule } from 'angularfire2/database';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrServiceProvider } from './providers/toastr-service/toastr-service';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireModule, FirebaseApp } from 'angularfire2';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import * as firebase from 'firebase';

export const firebaseConfig = {
  apiKey: "AIzaSyB2otQq45z8mad0rssNt_b8WEppursaxvk",
  authDomain: "system-teste.firebaseapp.com",
  databaseURL: "https://system-teste.firebaseio.com",
  projectId: "system-teste",
  storageBucket: "system-teste.appspot.com",
  messagingSenderId: "334623829924",
  appId: "1:334623829924:web:0829a02adc7f8618"
};


firebase.initializeApp(firebaseConfig);

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    }),
    AngularFireModule.initializeApp({
      firebaseConfig
    }),
    AngularFireDatabaseModule
  ],
  declarations: [AppComponent],
  providers: [
    InAppBrowser, 
    SplashScreen, 
    StatusBar, 
    FirebaseServiceProvider, 
    ToastrServiceProvider,
    ImagePicker,
    WebView,
    Crop,
    AngularFireAuth,
    AngularFirestore,
    AngularFireModule,
    GooglePlus
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
