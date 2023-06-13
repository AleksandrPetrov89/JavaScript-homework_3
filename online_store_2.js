class Good {

    constructor (id, name, description, sizes, price, available) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.sizes = sizes;
        this.price = price;
        this.available = available;
    };

    setAvailable(boolean) {
        this.available = boolean;
    };
};


class GoodsList {
    #goods;

    constructor (filter, sortPrice, sortDir) {
        this.#goods = new Array;
        this.filter = filter;
        this.sortPrice = sortPrice;
        this.sortDir = sortDir;
    };

    get list() {
        /* возвращает массив доступных для продажи товаров в соответствии с 
            установленным фильтром и сортировкой по полю Price */
        let filteredGoods = this.#goods.filter(element => this.filter.test(element.name) && element.available);
        if (this.sortPrice) {
            if (this.#goods.length > 1) {
                if (this.sortDir) {filteredGoods.sort((a, b) => a.price - b.price)}
                else {filteredGoods.sort((a, b) => b.price - a.price)};
            };
            
        };
        return filteredGoods;
    };

    add (good) {
        /* Добавляет товар в каталог. В качестве параметра принимает объект класса Good.
            Предварительно осуществляет проверку, что передаваемый объект является 
            объектом класса Good и что объекта с таким id ещё нет в каталоге*/
        if (good instanceof Good && !this.#goods.some(availabilityCheck, good.id)) {
            this.#goods.push(good);
        };
    };

    remove (id) {
        /* Удаляет товар из каталога по его id. В качестве параметра принимает id-номер,
            удаляемого объекта. */
        if (this.#goods.some(availabilityCheck, id)) {
            this.#goods.splice(this.#goods.findIndex(availabilityCheck, id), 1);
        };
    };
};


class BasketGood extends Good {
    constructor (good, amount) {
        super (good.id, good.name, good.description, good.sizes, good.price, good.available);
        this.amount = amount;
    };
};


class Basket {
    #goods;

    constructor() {
        this.#goods = [];
    };

    add (good, amount) {
    /* Добавляет указанный товар в выбранном количестве в корзину. 
        Если такой товар в корзине уже есть, то увеличивает его количество.
        В качестве параметров принимает экземпляр класса Good и число, 
        указывающее количество добавляемого товара. */
        if (good instanceof Good) {
            if (this.#goods.some(availabilityCheck, good.id)) {
                this.#goods[this.#goods.findIndex(availabilityCheck, good.id)].amount += amount;
            } else {
                this.#goods.push(new BasketGood(good, amount));
            };
        };
    };

    get list() {
        return this.#goods
    };

    remove (good, amount) {
        /* Уменьшает количество указанного товара в корзине, 
            если количество становится равным нулю, товар удаляется. 
            В качестве параметров принимает экземпляр класса Good и число, 
            указывающее количество удаляемого товара.*/
        if (good instanceof Good) {
            if (this.#goods.some(availabilityCheck, good.id)) {
                let index = this.#goods.findIndex(availabilityCheck, good.id);
                this.#goods[index].amount -= amount;
                if (this.#goods[index].amount < 1) {
                    this.#goods.splice(index, 1);
                };
            };
        };

    };

    clear() {
        /* Очищает содержимое корзины. */
        this.#goods.length = 0;
    };

    removeUnavailable() {
        /*Удаляет из корзины товары, которые недоступны для продажи (available === false). */
        this.#goods = this.#goods.filter(element => element.available === true);
    };

    get totalAmount() {
        /* Вычисляет общую стоимость товаров в корзине */
        let totalCost = 0;
        this.#goods.forEach(element => totalCost += element.price * element.amount);
        return totalCost;
    };

    get totalSum() {
        /* Вычисляет общее количество товаров в корзине */
        let initialValue = 0;
        return this.#goods.reduce((accumulator, element) => accumulator += element.amount, initialValue);
    };
};


const good_1 = new Good(1, 'name_1', 'description_1', [36, 38, 40, 41, 43], 499, true);
const good_2 = new Good(2, 'name_2', 'description_2', [37, 39, 42, 44], 999, true);
const good_3 = new Good(3, 'name_3', 'description_3', [38, 39, 40], 1499, true);
const good_4 = new Good(4, 'name_4', 'description_4', [39, 40, 41, 42, 43, 44], 1999, true);
const good_5 = new Good(5, 'name_5', 'description_5', [39, 41, 43], 2999, false);
const good_6 = new Good(6, 'name_6', 'description_6', [38, 39, 41, 42], 2999, true);

const goodsList_1 = new GoodsList(/nam/i, false, true);
goodsList_1.add(good_1);
goodsList_1.add(good_3);
goodsList_1.add(good_2);
goodsList_1.add(good_2);
// console.log("Изначальный каталог, c попыткой продублировать товар с id = 2");
// console.log(goodsList_1.list);

goodsList_1.remove(2);
// console.log("Каталог после удаления товара с id = 2");
// console.log(goodsList_1.list);

goodsList_1.add(good_2);
// console.log("Каталог после повторного добавления товара с id = 2");
// console.log(goodsList_1.list);

goodsList_1.sortPrice = true;
// console.log("Каталог с сортировкой по цене по возрастанию");
// console.log(goodsList_1.list);

goodsList_1.sortDir = false;
// console.log("Каталог с сортировкой по цене по убыванию");
// console.log(goodsList_1.list);

goodsList_1.filter = /name_1/i;
// console.log("Каталог с поиском товара name_1 с сортировкой по цене по убыванию");
// console.log(goodsList_1.list);

const basketGood_1 = new BasketGood(good_4, 4);
//console.log("Экземпляр класса BasketGood");
//console.log(basketGood_1);

const basket_1 = new Basket;
basket_1.add(good_1, 4);
basket_1.add(good_1, 2);
basket_1.add(good_2, 3);
// console.log("Содержимое корзины");
// console.log(basket_1.list);

basket_1.remove(good_1, 5);
basket_1.remove(good_2, 3);
// console.log("Содержимое корзины после удаления");
// console.log(basket_1.list);

basket_1.add(good_2, 2);
basket_1.add(good_3, 3);
basket_1.add(good_4, 4);
basket_1.add(good_5, 5);
// console.log("Всё содержимое корзины");
// console.log(basket_1.list);

basket_1.removeUnavailable();
console.log("\nСодержимое корзины, доступное для продажи: ");
console.log(basket_1.list);

console.log(`\nОбщая стоимость товаров в корзине составляет ${basket_1.totalAmount} руб.\n`);
console.log(`Общее количество товаров в корзине составляет ${basket_1.totalSum} шт.\n`);


function availabilityCheck (element) {
    /* Сравнивает искомый id с id передаваемого объекта.
        в this передается искомый id
        element - проверяемый объект */
    if ('id' in element) {
        return element.id == this;
    } else return false;
    
};