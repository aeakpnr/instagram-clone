import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FirebaseAppModule, initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideMessaging,getMessaging } from '@angular/fire/messaging';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './home/sidebar/sidebar.component';
import { HomePageComponent } from './home/home-page/home-page.component';
import { HomeRoutingModule } from './home/home-routing.module';
import { MessagesComponent } from './home/messages/messages.component';
import { DiscoverComponent } from './home/discover/discover.component';
import { ProfileComponent } from './home/profile/profile.component';



@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HomeComponent,
    SidebarComponent,
    HomePageComponent,
    MessagesComponent,
    DiscoverComponent,
    ProfileComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FirebaseAppModule,
    HomeRoutingModule,

    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideMessaging(() => getMessaging()),
    provideFirestore(() => getFirestore()),
  ],
  providers: [{ provide: FIREBASE_OPTIONS, useValue: environment.firebase }],
  bootstrap: [AppComponent]
})
export class AppModule { }
