import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'

@Component({
    selector: 'app-statistics-page',
    templateUrl: './statistics-page.component.html',
    styleUrls: ['./statistics-page.component.scss'],
})
export class StatisticsPageComponent implements OnInit {
    pageTitle = 'Статистика'
    trainServer = 'http://localhost:4000/api/trains'
    ticketServer = 'http://localhost:4000/api/tickets'
    searchData = [] as TicketData
    isSearching = false
    popularRoutes: any = []
    profitableRoutes: any = []
    emptyRoutes: any = []

    data: TicketData
    searchForm: FormGroup

    constructor(private http: HttpClient) {
        this.fetchData()
        this.getPopularRoutes()
        this.getProfitableRoutes()
        this.getEmptyRoutes()
    }

    ngOnInit(): void {
        this.searchForm = new FormGroup({
            search: new FormControl(''),
        })

        this.searchForm.valueChanges.subscribe(this.onSearchChange.bind(this))
    }

    async fetchData() {
        this.data = await this.http.get<Ticket[]>(this.ticketServer).toPromise()
    }

    onSearchChange({ search }: { search: string }) {
        const query = search.toLowerCase().trim()

        if (query.length === 0) {
            this.isSearching = false
            return
        }
        if (isNaN(+query)) {
            this.isSearching = false
            return
        }

        this.isSearching = true
        this.searchData = this.data?.filter(item => +item.train === +query)
    }

    async getPopularRoutes() {
        const tickets = await this.http.get<Ticket[]>(this.ticketServer).toPromise()

        const routes = tickets?.reduce((acc: any, item) => {
            if (acc[item.train]) {
                acc[item.train] += 1
            } else {
                acc[item.train] = 1
            }

            return acc
        }, {})

        this.popularRoutes = Object.entries(routes).sort((a: any, b: any) => b[1] - a[1])
    }

    async getProfitableRoutes() {
        const tickets = await this.http.get<Ticket[]>(this.ticketServer).toPromise()

        const routes = tickets?.reduce((acc: any, item) => {
            if (acc[item.train]) {
                acc[item.train] += item.price
            } else {
                acc[item.train] = item.price
            }

            return acc
        }, {})

        this.profitableRoutes = Object.entries(routes).sort((a: any, b: any) => b[1] - a[1])
    }

    async getEmptyRoutes() {
        const tickets = await this.http.get<Ticket[]>(this.ticketServer).toPromise()
        const trains = await this.http.get<Train[]>(this.trainServer).toPromise()

        const routes = trains?.reduce((acc: any, item) => {
            if (!acc[item.id]) {
                acc[item.id] = 0
            }

            return acc
        }, {})

        tickets?.forEach(item => {
            if (routes[item.train] !== undefined) {
                routes[item.train] += 1
            }
        })

        this.emptyRoutes = Object.entries(routes).sort((a: any, b: any) => a[1] - b[1])
    }
}
