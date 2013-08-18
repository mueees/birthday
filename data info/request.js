db.event.remove()
db.event.count()
db.event.findOne()

db.event.find({
    $and:[
        {
            "dateStart.dateStartObj": {
                $lte: "dt_range.endObj"
            }
        }
    ]
})

db.event.find({
    $and:[
        {
            "dateStart.dateStartObj": {
                $lte: new Date(2013, 19, 1)
            }
        }
    ]
})



db.event.insert({
    date: new Date(2013, 7, 18)
})