export default class Collection {
    constructor(data, entityClass) {
        this.data = data;
        this.entityClass = entityClass;
        this.map = {};

        this.applyModifiers();
        this.createDefaultMap();
    }

    applyModifiers() {
        for (let entry of this.data) {
            this.entityClass.applyModifiers(entry);
        }
    }

    createDefaultMap() {
        if (this.data[0]) {
            if (this.data[0].ID) {
                this.primaryKey = 'ID';
            } else if (this.data[0].id) {
                this.primaryKey = 'id';
            }

            this.createMap(this.primaryKey);
        }
    }

    /**
     * Used for getBy()
     * @param {string} field
     */
    createMap(field) {
        const mapKey = field; //this.snakeToCamelCase(field);
        this.map[mapKey] = {};

        this.data.map((item, i) => {
            this.map[mapKey][item[field]] = i;
        });
    }

    getAll() {
        return this.data;
    }

    [Symbol.iterator]() {
        let i = -1;

        return {
            next: () => {
                if (!this.data[++i]) {
                    return {
                        value: undefined,
                        done: true,
                    };
                }

                return {
                    value: this.data[i],
                    done: false,
                }
            }
        };
    }

    /**
     * Returns item by primary. If item isn't found, empty object is returned
     *
     * @param id
     * @returns {Object}
     */
    getById(id) {
        if (!this.primaryKey) {
            return {};
        }

        const index = this.map[this.primaryKey][id];

        if (index === undefined) {
            return {};
        }

        return this.data[index];
    }

    /**
     * Finds entry by map
     *
     * @param {string} field
     * @param {string} value
     */
    getBy(field, value) {
        const index = this.map[field][value];

        if (index === undefined) {
            return {};
        }

        return this.data[index] || {};
    }
}