import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'

import { formatDate, rabinKarp } from 'src/app/utils/utils'

@Component({
    selector: 'app-tickets-page',
    templateUrl: './tickets-page.component.html',
    styleUrls: ['./tickets-page.component.scss'],
})
export class TicketsPageComponent implements OnInit {
    pageTitle = 'Квитки'
    server = 'http://localhost:4000/api/tickets'
    passengerServer = 'http://localhost:4000/api/passengers'
    trainServer = 'http://localhost:4000/api/trains'
    log = ''
    searchData = [] as TicketData
    isSearching = false

    data: TicketData
    passengerData: PassengerData
    trainData: TrainData
    addForm: FormGroup
    editForm: FormGroup
    deleteForm: FormGroup
    searchForm: FormGroup

    constructor(private http: HttpClient) {
        this.fetchData()
        this.fetchOtherData()
    }

    ngOnInit(): void {
        this.addForm = new FormGroup({
            passenger: new FormControl(''),
            train: new FormControl(''),
            price: new FormControl(''),
            seat: new FormControl(''),
            date: new FormControl(''),
        })

        this.editForm = new FormGroup({
            id: new FormControl(''),
            passenger: new FormControl(''),
            train: new FormControl(''),
            price: new FormControl(''),
            seat: new FormControl(''),
            date: new FormControl(''),
        })

        this.deleteForm = new FormGroup({
            id: new FormControl(''),
        })

        this.searchForm = new FormGroup({
            search: new FormControl(''),
        })

        this.searchForm.valueChanges.subscribe(this.onSearchChange.bind(this))
    }

    async fetchData() {
        this.data = await this.http.get<Ticket[]>(this.server).toPromise()
    }

    async fetchOtherData() {
        this.passengerData = await this.http.get<Passenger[]>(this.passengerServer).toPromise()
        this.trainData = await this.http.get<Train[]>(this.trainServer).toPromise()
    }

    async onAddSubmit() {
        const { passenger, train, price, seat, date } = this.addForm.value

        if (!this.validateData({ passenger, train, price, seat, date })) {
            return
        }

        const res = await this.http
            .post<Ticket>(this.server, {
                passenger,
                train,
                price,
                seat,
                date,
            })
            .toPromise()

        if (typeof res?.id !== 'number') {
            console.log(res)
            this.log = 'Виникла помилка'
            return
        }

        this.addForm.reset()
        this.data?.push(res)
        this.log = 'Додано ✅'
    }

    async onEditSubmit() {
        const { id, passenger, train, price, seat, date } = this.editForm.value

        if (!this.validateId(id)) {
            return
        }
        if (!this.validateData({ passenger, train, price, seat, date })) {
            return
        }

        const oldData = this.data?.find(item => +item.id === +id)

        const res = await this.http
            .put<PutDeleteResponse>(this.server, {
                ...oldData,
                passenger,
                train,
                price,
                seat,
                date,
            })
            .toPromise()

        if (res?.message !== 'updated') {
            console.log(res)
            this.log = 'Виникла помилка'
            return
        }

        this.editForm.reset()
        this.log = 'Відредаговано ✅'
        this.fetchData()
    }

    async onDeleteSubmit() {
        const { id } = this.deleteForm.value

        if (!this.validateId(id)) {
            return
        }

        const res = await this.http
            .delete<PutDeleteResponse>(this.server, {
                body: {
                    id,
                },
            })
            .toPromise()

        if (res?.message !== 'deleted') {
            console.log(res)
            this.log = 'Виникла помилка'
            return
        }

        this.deleteForm.reset()
        this.log = 'Видалено ✅'
        this.fetchData()
    }

    onSearchChange({ search }: { search: string }) {
        const query = search.toLowerCase().trim()

        if (query.length === 0) {
            this.isSearching = false
            this.log = 'Пошук скасовано. Введіть запит для пошуку'
            return
        }

        this.isSearching = true
        this.searchData = this.data?.filter(item => {
            const passenger = item.passenger.toString()
            const train = item.train.toString()
            const price = item.price.toString()
            const seat = item.seat.toString()
            const date = item.date.toLowerCase()

            return rabinKarp(`${passenger} ${train} ${price} ${seat} ${formatDate(date)}`, query)
        })
        this.log = `Знайдено: ${this.searchData?.length} ✅`
    }

    validateId(id: string) {
        if (id.length === 0) {
            this.log = 'Введіть ID квитка'
            return false
        }
        if (isNaN(+id)) {
            this.log = 'ID повинен містити тільки цифри'
            return false
        }
        if (!this.data?.find(item => +item.id === +id)) {
            this.log = `Квитка з ID ${id} не існує`
            return false
        }

        return true
    }

    validateData({
        passenger,
        train,
        price,
        seat,
        date,
    }: {
        passenger: string
        train: string
        price: string
        seat: string
        date: string
    }) {
        if (passenger.length === 0) {
            this.log = 'Введіть ID пасажира'
            return false
        }
        if (train.length === 0) {
            this.log = 'Введіть ID поїзда'
            return false
        }
        if (price.length === 0) {
            this.log = 'Введіть ціну квитка'
            return false
        }
        if (seat.length === 0) {
            this.log = 'Введіть номер місця'
            return false
        }
        if (date.length === 0) {
            this.log = 'Введіть дату відправлення'
            return false
        }
        if (isNaN(+passenger)) {
            this.log = 'ID пасажира повинен містити тільки цифри'
            return false
        }
        if (isNaN(+train)) {
            this.log = 'ID поїзда повинен містити тільки цифри'
            return false
        }
        if (isNaN(+price)) {
            this.log = 'Ціна квитка повинна містити тільки цифри'
            return false
        }
        if (isNaN(+seat)) {
            this.log = 'Номер місця повинен містити тільки цифри'
            return false
        }

        if (!this.passengerData?.find(item => +item.id === +passenger)) {
            this.log = `Пасажира з ID ${passenger} не існує`
            return false
        }
        if (!this.trainData?.find(item => +item.id === +train)) {
            this.log = `Поїзда з ID ${train} не існує`
            return false
        }

        const ticket = this.data?.find(
            item => +item.train === +train && +item.seat === +seat && item.date === date,
        )

        if (ticket) {
            this.log = `Квиток на поїзд ${train} з номером місця ${seat} на дату ${formatDate(
                date,
            )} вже існує`
            return false
        }

        const seats = this.trainData?.find(item => +item.id === +train)?.capacity
        const tickets = this.data?.filter(item => +item.train === +train && item.date === date)

        if (tickets?.length !== undefined && seats !== undefined && tickets?.length >= seats) {
            this.log = `Поїзд ${train} вже заповнений`
            return false
        }

        return true
    }
}
