export default class NestedSet {
    get ID() {
        return 0;
    }

    get LEFT() {
        return 1;
    }

    get RIGHT() {
        return 2;
    }

    get LEVEL() {
        return 3;
    }


    constructor({ items, primaryKey, parentKey, depthLevelKey, sort })
    {
        if (!items) {
            throw new Error('"items" is required');
        }

        this.items = items;

        if (!primaryKey) {
            throw new Error('"primaryKey" is required');
        }

        this.primaryKey = primaryKey;

        if (!parentKey) {
            throw new Error('"parentKey" is required');
        }

        this.parentKey = parentKey;

        if (!sort) {
            throw new Error('"sort" is required');
        }

        this.sortCallable = sort;

        this.depthLevelKey = depthLevelKey || 'DEPTH_LEVEL';

        this.rebuildItemsByPrimaryKey();
        //this.sort();
        this.calculateParents();
        this.buildLevelMap();
        this.initTree();
        this.buildTree();
    }

    rebuildItemsByPrimaryKey() {
        this.items = Object.fromEntries(this.items.map(item => [item[this.primaryKey], item]));
    }

    /*sort() {
        uasort(this.items, this.sortCallable);
    }*/

    /**
     * Fills PATH with parents of item
     */
    calculateParents() {
        this.paths = [];

        for (let item of Object.values(this.items)) {
            let parentId = parseInt(item[this.parentKey]);
            this.paths[item[this.primaryKey]] = [];

            while (parentId) {
                this.paths[item[this.primaryKey]].unshift(parentId);
                parentId = parseInt(this.items[parentId][this.parentKey]);
            }
        }
    }

    /**
     * Generates list of items, which are grouped by depth level
     */
    buildLevelMap() {
        this.levelMap = [];

        for (let item of Object.values(this.items)) {
            let level = this.paths[item[this.primaryKey]].length;

            if (!this.levelMap[level]) {
                this.levelMap[level] = [];
            }

            this.levelMap[level].push(parseInt(item[this.primaryKey]));
        }
    }

    /**
     * Initializes tree, creates root node
     */
    initTree() {
        this.structure = {
            0: {
                [this.ID]: 0,
                [this.LEFT]: 1,
                [this.RIGHT]: 2,
                [this.LEVEL]: 0
            }
        };
    }

    buildTree() {
        const maxLevel = this.levelMap.length;

        for (let level = 0; level < maxLevel; level++) {
            for (let itemId of this.levelMap[level]) {
                this.insertNode(itemId, parseInt(this.items[itemId][this.parentKey] || 0));
            }
        }
    }

    insertNode(id, parentId) {
        const parentRightKey = this.structure[parentId][this.RIGHT];
        const parentLevel = this.structure[parentId][this.LEVEL];

        if (!parentRightKey) {
            return;
        }

        this.updateTreeForInsert(parentRightKey, true);

        this.structure[id] = {
            [this.ID]: id,
            [this.LEFT]: parentRightKey,
            [this.RIGHT]: parentRightKey + 1,
            [this.LEVEL]: parentLevel + 1,
        };
    }

    /**
     * @param {Number} id
     * @param {Number} targetId
     */
    insertNodeBefore(id, targetId) {
        const targetLeft = this.structure[targetId][this.LEFT];
        const targetRight = this.structure[targetId][this.RIGHT];
        const targetLevel = this.structure[targetId][this.LEVEL];
        let afterTargetId = null;

        // Find previous node
        for (let [newTargetId, data] of Object.entries(this.structure)) {
            if (data[this.RIGHT] === targetLeft - 1) {
                afterTargetId = newTargetId;
                break;
            }
        }

        if (this.structure[afterTargetId][this.LEVEL] === targetLevel) {
            this.insertNodeAfter(id, afterTargetId);
        } else {
            let [targetParentId, targetParentData] = this.getParentNode(targetId);
            // Insert before first node
            this.updateTreeForInsert(targetLeft, true);

            this.structure[id] = {
                [this.ID]: id,
                [this.LEFT]: targetParentData[this.LEFT] + 1,
                [this.RIGHT]: targetParentData[this.LEFT] + 2,
                [his.LEVEL]: targetLevel,
            };
        }
    }

    /**
     * @param {Number} id
     * @param {Number} targetId
     */
    insertNodeAfter(id, targetId) {
        const targetLeft = this.structure[targetId][this.LEFT];
        const targetRight = this.structure[targetId][this.RIGHT];
        const targetLevel = this.structure[targetId][this.LEVEL];

        this.updateTreeForInsert(targetRight, false);

        this.structure[id] = {
            [this.ID]: id,
            [this.LEFT]: targetRight + 1,
            [this.RIGHT]: targetRight + 2,
            [this.LEVEL]: targetLevel,
        };
    }

    /**
     * @param {Number} targetRight
     * @param {Boolean} isParent
     */
    updateTreeForInsert(targetRight, isParent) {
        for (let [nodeId, data] of Object.entries(this.structure)) {
            // Update nodes after new
            if (data[this.LEFT] > targetRight) {
                data[this.LEFT] = data[this.LEFT] + 2;
                data[this.RIGHT] = data[this.RIGHT] + 2;
            }

            // Update parent branch
            if (
                // Update right key of target mode, the place is in end of a parent
                isParent === true && data[this.RIGHT] >= targetRight && data[this.LEFT] < targetRight
                // Don't touch target, the place is after target
                || isParent === false && data[this.RIGHT] > targetRight && data[this.LEFT] < targetRight
            ) {
                data[this.RIGHT] = data[this.RIGHT] + 2;
            }
        }
    }

    /**
     * Returns ordered list with items node data
     * @return array
     */
    getTree() {
        let result = Object.values(this.structure).sort(this.sortByLeft.bind(this));
        return result;
    }

    sortByLeft(nodeA, nodeB) {
        return nodeA[this.LEFT] < nodeB[this.LEFT] ? -1 : 1;
    }

    /**
     * Returns ordered list of children
     *
     * @param {Number|Array} parent Section ID or node data
     * @return array
     */
    getChildren(parent) {
        let left, right, level;

        if (Array.isArray(parent)) {
            left = parent[this.LEFT];
            right = parent[this.RIGHT];
            level = parent[this.LEVEL];
        } else {
            left = this.structure[parent][this.LEFT];
            right = this.structure[parent][this.RIGHT];
            level = this.structure[parent][this.LEVEL];
        }

        const branch = [];

        // LEVEL
        for (let [sectionId, data] of Object.entries(this.structure)) {
            if (data[this.LEFT] > left && data[this.RIGHT] < right && data[this.LEVEL] === level + 1) {
                branch[sectionId] = data;
            }
        }

        let result = Object.values(branch);
        result.sort(this.sortByLeft);

        return result;
    }

    getParentNode(id) {
        const left = this.structure[id][this.LEFT];
        const right = this.structure[id][this.RIGHT];
        const level = this.structure[id][this.LEVEL];
        const result = [];

        for (let [sectionId, data] of Object.entries(this.structure)) {
            if (data[this.LEFT] < left && data[this.RIGHT] > right && data[this.LEVEL] === level - 1) {
                result[sectionId] = data;
                break;
            }
        }

        return result;
    }

    /**
     * @return {Object}
     */
    getStructured() {
        const result = {
            items: {},
            children: {},
        };

        for (let node of this.getTree()) {
            if (!node[this.ID]) {
                continue;
            }

            result.items[node[this.ID]] = this.items[node[this.ID]];

            if (result.items[node[this.ID]][this.depthLevelKey]) {
                result.items[node[this.ID]][this.depthLevelKey] = node[this.LEVEL];
            }

            result.children[result.items[parseInt(node[this.ID])][this.parentKey]].push(node[this.ID]);
        }

        return result;
    }

    getFlat() {
        const result = [];

        for (let node of this.getTree()) {
            if (!node[this.ID]) {
                continue;
            }

            let item = {
                ...this.items[node[this.ID]]
            };

            item[this.depthLevelKey] = node[this.LEVEL];
            result.push(item);
        }

        return result;
    }
}
