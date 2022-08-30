  const leadsMy = {
    "_page": 1,
    "_links": {
        "self": {
            "href": "https://alekseirizchkov.amocrm.ru/api/v4/leads?page=1&limit=50"
        }
    },
    "_embedded": {
        "leads": [
            {
                "id": 2841691,
                "name": "Запрос тарифов",
                "price": 14000,
                "responsible_user_id": 8499319,
                "group_id": 0,
                "status_id": 50272636,
                "pipeline_id": 5721550,
                "loss_reason_id": null,
                "created_by": 8499319,
                "updated_by": 8499319,
                "created_at": 1661709389,
                "updated_at": 1661760858,
                "closed_at": null,
                "closest_task_at": null,
                "is_deleted": false,
                "custom_fields_values": null,
                "score": null,
                "account_id": 30363148,
                "labor_cost": null,
                "_links": {
                    "self": {
                        "href": "https://alekseirizchkov.amocrm.ru/api/v4/leads/2841691?page=1&limit=50"
                    }
                },
                "_embedded": {
                    "tags": [],
                    "companies": []
                }
            },
            {
                "id": 2841687,
                "name": "Рекламная продукция",
                "price": 11000,
                "responsible_user_id": 8499319,
                "group_id": 0,
                "status_id": 50272636,
                "pipeline_id": 5721550,
                "loss_reason_id": null,
                "created_by": 8499319,
                "updated_by": 8499319,
                "created_at": 1661709383,
                "updated_at": 1661761131,
                "closed_at": null,
                "closest_task_at": null,
                "is_deleted": false,
                "custom_fields_values": null,
                "score": null,
                "account_id": 30363148,
                "labor_cost": null,
                "_links": {
                    "self": {
                        "href": "https://alekseirizchkov.amocrm.ru/api/v4/leads/2841687?page=1&limit=50"
                    }
                },
                "_embedded": {
                    "tags": [],
                    "companies": []
                }
            }
        ]
    }
}


// console.log(leads._embedded.leads[0])

// module.exports = leads;