import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'

import { rabinKarp } from 'src/app/utils/utils'

@Component({
    selector: 'app-passengers-page',
    templateUrl: './passengers-page.component.html',
    styleUrls: ['./passengers-page.component.scss'],
})
export class PassengersPageComponent implements OnInit {
    pageTitle = 'Пасажири'
    server = 'http://localhost:4000/api/passengers'
    log = ''
    searchData = [] as PassengerData
    isSearching = false

    data: PassengerData
    addForm: FormGroup
    editForm: FormGroup
    deleteForm: FormGroup
    searchForm: FormGroup

    constructor(private http: HttpClient) {
        this.fetchData()
    }

    ngOnInit(): void {
        this.addForm = new FormGroup({
            surname: new FormControl(''),
            name: new FormControl(''),
            passport: new FormControl(''),
        })

        this.editForm = new FormGroup({
            id: new FormControl(''),
            surname: new FormControl(''),
            name: new FormControl(''),
            passport: new FormControl(''),
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
        this.data = await this.http.get<Passenger[]>(this.server).toPromise()
    }

    async onAddSubmit() {
        const { surname, name, passport } = this.addForm.value

        if (!this.validateData({ surname, name, passport })) {
            return
        }

        const res = await this.http
            .post<Passenger>(this.server, {
                surname,
                name,
                passport,
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
        const { id, surname, name, passport } = this.editForm.value

        if (!this.validateId(id)) {
            return
        }
        if (!this.validateData({ surname, name, passport })) {
            return
        }

        const oldData = this.data?.find(item => +item.id === +id)

        const res = await this.http
            .put<PutDeleteResponse>(this.server, {
                ...oldData,
                surname,
                name,
                passport,
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
            const id = item.id.toString()
            const surname = item.surname.toLowerCase()
            const name = item.name.toLowerCase()
            const passport = item.passport.toString()

            return rabinKarp(`${id} ${surname} ${name} ${passport}`, query)
        })
        this.log = `Знайдено: ${this.searchData?.length} ✅`
    }

    validateId(id: string) {
        if (id.length === 0) {
            this.log = 'Введіть ID пасажира'
            return false
        }
        if (isNaN(+id)) {
            this.log = 'ID повинен містити тільки цифри'
            return false
        }
        if (!this.data?.find(item => +item.id === +id)) {
            this.log = `Пасажира з ID ${id} не існує`
            return false
        }

        return true
    }

    validateData({ surname, name, passport }: { surname: string; name: string; passport: string }) {
        const isPassportUnique = this.data?.every(item => +item.passport !== +passport)

        if (surname.length === 0) {
            this.log = 'Введіть прізвище пасажира'
            return false
        }
        if (name.length === 0) {
            this.log = 'Введіть імʼя пасажира'
            return false
        }
        if (passport.length === 0) {
            this.log = 'Введіть паспорт пасажира'
            return false
        }
        if (isNaN(+passport)) {
            this.log = 'Паспорт повинен містити тільки цифри'
            return false
        }
        if (!isPassportUnique) {
            this.log = `Паспорт ${passport} вже існує в базі даних`
            return false
        }

        return true
    }
}
