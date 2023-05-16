import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { MainPageComponent } from './components/main-page/main-page.component'
import { NavbarComponent } from './components/navbar/navbar.component'
import { PassengersPageComponent } from './components/passengers-page/passengers-page.component'
import { SpacerComponent } from './components/spacer/spacer.component'
import { StatisticsPageComponent } from './components/statistics-page/statistics-page.component'
import { TicketsPageComponent } from './components/tickets-page/tickets-page.component'
import { TrainsPageComponent } from './components/trains-page/trains-page.component'

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        MainPageComponent,
        PassengersPageComponent,
        TrainsPageComponent,
        TicketsPageComponent,
        StatisticsPageComponent,
        SpacerComponent,
    ],
    imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule, HttpClientModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
