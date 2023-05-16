// global
interface PutDeleteResponse {
    message: string
}

// passengers
interface Passenger {
    id: number
    surname: string
    name: string
    passport: number
}
type PassengerData = Passenger[] | undefined

// trains
interface Train {
    id: number
    name: string
    route: {
        from: string
        to: string
    }
    capacity: number
}
type TrainData = Train[] | undefined

// tickets
interface Ticket {
    id: number
    price: number
    passenger: number
    train: number
    seat: number
    date: string
}
type TicketData = Ticket[] | undefined
