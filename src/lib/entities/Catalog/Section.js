import AbstractEntity from 'lib/entities/AbstractEntity';
import BX24 from 'lib/BX24';

export default class Section extends AbstractEntity {
    static get fieldsEndpoint() {
        return 'catalog.section.getFields';
    }

    static get endpoint() {
        return 'catalog.section.get';
    }

    static get listEndpoint() {
        return 'catalog.section.list';
    }

    static get addEndpoint() {
        return 'catalog.section.add';
    }

    static get updateEndpoint() {
        return 'catalog.section.update';
    }

    static get deleteEndpoint() {
        return 'catalog.section.delete';
    }

    static get domain() {
        return 'section';
    }

    static get listDomain() {
        return 'sections';
    }

    static get defaultSelect() {
        return ['*'];
    }

    static get defaultOrder() {
        return {'id': 'asc'};
    }
}
