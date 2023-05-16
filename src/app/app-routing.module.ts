import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { MainPageComponent } from 'src/app/components/main-page/main-page.component'
import { PassengersPageComponent } from 'src/app/components/passengers-page/passengers-page.component'
import { StatisticsPageComponent } from 'src/app/components/statistics-page/statistics-page.component'
import { TicketsPageComponent } from 'src/app/components/tickets-page/tickets-page.component'
import { TrainsPageComponent } from 'src/app/components/trains-page/trains-page.component'

const routes: Routes = [
    {
        path: '',
        component: MainPageComponent,
    },
    {
        path: 'passengers',
        component: PassengersPageComponent,
    },
    {
        path: 'trains',
        component: TrainsPageComponent,
    },
    {
        path: 'tickets',
        component: TicketsPageComponent,
    },
    {
        path: 'statistics',
        component: StatisticsPageComponent,
    },
    {
        path: '**',
        redirectTo: '',
    },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
