const { Keyboard } = require("vk-io");

const key = Keyboard.textButton;
const keyad = Keyboard.urlButton;

const colors = {
    green: Keyboard.POSITIVE_COLOR,
    red: Keyboard.NEGATIVE_COLOR,
    gray: Keyboard.SECONDARY_COLOR,
    blue: Keyboard.PRIMARY_COLOR
}

module.exports = {
    chat: [
        [
            key({label:"Клан войти 26274",color: colors.green})
        ],
        [
            key({label:"Профиль",color:colors.gray}),
            key({label:"Клан",color:colors.gray}),
            key({label:"Клан у",color: colors.gray}),
            key({label:"Баланс",color:colors.gray})
        ],
        [
            key({label:"Бизнес снять 1 все",color:colors.green}),
            key({label:"Бизнес снять 2 все",color:colors.green}),
            key({label:"Ферма",color:colors.green}),
            key({label:"Бонус",color:colors.green}),
            key({label:"Банк все",color:colors.green})
        ],
        [
            key({label:"Продать биткоины",color:colors.red}),
            key({label:"Продать руду", color:colors.red}),
            key({label:"Рудник пополнить",color:colors.red}),
            key({label:"Банк снять все", color:colors.red})
        ],
        [
            key({label:"Ограб",color:colors.blue}),
            key({label:"Начать ограб",color:colors.blue}),
            key({label:"Участники ограб",color:colors.blue}),
            key({label:"Кв",color:colors.blue}),
            key({label:"Бой",color:colors.green})
        ],
        [
            key({label:"Предметы",color:colors.blue}),
            key({label:"Предметы 1",color:colors.gray}),
            key({label:"Предметы 2",color:colors.gray}),
            key({label:"Предметы 3",color:colors.gray}),
            key({label:"Предметы 4",color:colors.gray})
        ],
        [
            key({label:"Предметы 5",color:colors.gray}),
            key({label:"Предметы 6",color:colors.gray}),
            key({label:"Предметы 7",color:colors.gray}),
            key({label:"Предметы 8",color:colors.gray}),
            key({label:"Предметы 9",color:colors.gray})
        ],
        [
            key({label:"Предметы 10",color:colors.gray}),
            key({label:"Предметы 11",color:colors.gray}),
            key({label:"Предметы 12",color:colors.gray}),
            key({label:"Предметы 13",color:colors.gray}),
            key({label:"Предметы 14",color:colors.gray})
        ],
        [
            key({label:"Зоотовары 6", color: colors.blue}),
            key({label:"Зоотовары 7", color: colors.blue}),
            key({label:"Зоотовары 8", color: colors.blue}),
        ],
        [
            key({label:"Работать",color:colors.green}),
            key({label:"Уволиться",color: colors.red})
        ]
    ],
    ad:[
        [
            keyad({label:"Клан",url:"https://vk.me/join/AJQ1d/ZjlQ9s_S8IYDEqwk_q"}),
            keyad({label:"Клан",url:"https://vk.me/join/AJQ1d/ZjlQ9s_S8IYDEqwk_q"}),
            keyad({label:"Клан",url:"https://vk.me/join/AJQ1d/ZjlQ9s_S8IYDEqwk_q"}),
            keyad({label:"Клан",url:"https://vk.me/join/AJQ1d/ZjlQ9s_S8IYDEqwk_q"}),
            keyad({label:"Клан",url:"https://vk.me/join/AJQ1d/ZjlQ9s_S8IYDEqwk_q"})
        ],
        [
            keyad({label:"Клан",url:"https://vk.me/join/AJQ1d/ZjlQ9s_S8IYDEqwk_q"}),
            keyad({label:"Клан",url:"https://vk.me/join/AJQ1d/ZjlQ9s_S8IYDEqwk_q"}),
            keyad({label:"Клан",url:"https://vk.me/join/AJQ1d/ZjlQ9s_S8IYDEqwk_q"}),
            keyad({label:"Клан",url:"https://vk.me/join/AJQ1d/ZjlQ9s_S8IYDEqwk_q"}),
            keyad({label:"Клан",url:"https://vk.me/join/AJQ1d/ZjlQ9s_S8IYDEqwk_q"})
        ]
    ]
}