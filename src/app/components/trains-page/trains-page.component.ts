import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'

import { rabinKarp } from 'src/app/utils/utils'

@Component({
    selector: 'app-trains-page',
    templateUrl: './trains-page.component.html',
    styleUrls: ['./trains-page.component.scss'],
})
export class TrainsPageComponent implements OnInit {
    pageTitle = 'Потяги'
    server = 'http://localhost:4000/api/trains'
    log = ''
    searchData = [] as TrainData
    isSearching = false

    data: TrainData
    addForm: FormGroup
    editForm: FormGroup
    deleteForm: FormGroup
    searchForm: FormGroup

    constructor(private http: HttpClient) {
        this.fetchData()
    }

    ngOnInit(): void {
        this.addForm = new FormGroup({
            name: new FormControl(''),
            from: new FormControl(''),
            to: new FormControl(''),
            capacity: new FormControl(''),
        })

        this.editForm = new FormGroup({
            id: new FormControl(''),
            name: new FormControl(''),
            from: new FormControl(''),
            to: new FormControl(''),
            capacity: new FormControl(''),
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
        this.data = await this.http.get<Train[]>(this.server).toPromise()
    }

    async onAddSubmit() {
        const { name, from, to, capacity } = this.addForm.value

        if (!this.validateData({ name, from, to, capacity })) {
            return
        }

        const res = await this.http
            .post<Train>(this.server, {
                name,
                route: {
                    from,
                    to,
                },
                capacity,
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
        const { id, name, from, to, capacity } = this.editForm.value

        if (!this.validateId(id)) {
            return
        }

        if (!this.validateData({ name, from, to, capacity })) {
            return
        }

        const oldData = this.data?.find(item => +item.id === +id)

        const res = await this.http
            .put<PutDeleteResponse>(this.server, {
                ...oldData,
                name,
                route: {
                    from,
                    to,
                },
                capacity,
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

    async onSearchChange({ search }: { search: string }) {
        const query = search.toLowerCase().trim()

        if (!search) {
            this.isSearching = false
            this.log = 'Пошук скасовано. Введіть запит для пошуку'
            return
        }

        this.isSearching = true
        this.searchData = this.data?.filter(item => {
            const id = item.id.toString()
            const name = item.name.toLowerCase()
            const route = `${item.route.from.toLowerCase()}-${item.route.to.toLowerCase()}`
            const capacity = item.capacity.toString()

            return rabinKarp(`${id} ${name} ${route} ${capacity}`, query)
        })
        this.log = `Знайдено: ${this.searchData?.length} ✅`
    }

    validateId(id: string) {
        if (id.length === 0) {
            this.log = 'Введіть ID потягу'
            return false
        }
        if (isNaN(+id)) {
            this.log = 'ID потягу повинен містити тільки цифри'
            return false
        }
        if (!this.data?.find(item => +item.id === +id)) {
            this.log = `Потягу з ID ${id} не існує`
            return false
        }

        return true
    }

    validateData({
        name,
        from,
        to,
        capacity,
    }: {
        name: string
        from: string
        to: string
        capacity: string
    }) {
        if (!name) {
            this.log = 'Введіть назву потягу'
            return false
        }
        if (!from) {
            this.log = 'Введіть маршрут потягу'
            return false
        }
        if (!to) {
            this.log = 'Введіть маршрут потягу'
            return false
        }
        if (!capacity) {
            this.log = 'Введіть кількість місць в потягу'
            return false
        }
        if (isNaN(+capacity)) {
            this.log = 'Кількість місць повинна містити тільки цифри'
            return false
        }

        return true
    }
}
