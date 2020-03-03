import IndexPage from 'components/IndexPage';
import CrmDealList from 'components/modules/Crm/DealList.vue';
import CrmDealFields from 'components/modules/Crm/DealFields.vue';
import CrmDealStages from 'components/modules/Crm/DealStages.vue';
import CrmLeadList from 'components/modules/Crm/LeadList.vue';
import CrmLeadFields from 'components/modules/Crm/LeadFields.vue';
import CrmLeadStatuses from 'components/modules/Crm/LeadStatuses.vue';
import CrmStatusTypes from 'components/modules/Crm/StatusTypes.vue';
import CrmSources from 'components/modules/Crm/Sources.vue';
import EntityList from 'components/modules/Entity/EntityList.vue';
import EntityAdd from 'components/modules/Entity/EntityAdd.vue';
import EntityProperties from 'components/modules/Entity/EntityProperties.vue';
import EntityPropertyAdd from 'components/modules/Entity/EntityPropertyAdd.vue';
import EntityRights from 'components/modules/Entity/EntityRights.vue';
import EntityRightsAdd from 'components/modules/Entity/EntityRightsAdd.vue';
import EntityItemList from 'components/modules/Entity/EntityItemList.vue';
import EventList from 'components/modules/Event/EventList.vue';
import PlacementList from 'components/modules/Placement/PlacementList.vue';
import PlacementTypes from 'components/modules/Placement/PlacementTypes.vue';

export default [
    {
        path: '/',
        name: 'index',
        component: IndexPage,
    },
    {
        path: '/crm/deal/fields',
        name: 'crmDealFields',
        component: CrmDealFields,
    },
    {
        path: '/crm/deal/list',
        name: 'crmDealList',
        component: CrmDealList,
    },
    {
        path: '/crm/deal/stages',
        name: 'crmDealStages',
        component: CrmDealStages,
    },
    {
        path: '/crm/lead/fields',
        name: 'crmLeadFields',
        component: CrmLeadFields,
    },
    {
        path: '/crm/lead/list',
        name: 'crmLeadList',
        component: CrmLeadList,
    },
    {
        path: '/crm/lead/statuses',
        name: 'crmLeadStatuses',
        component: CrmLeadStatuses,
    },
    {
        path: '/crm/status/types',
        name: 'crmStatusTypes',
        component: CrmStatusTypes,
    },
    {
        path: '/crm/status/sources',
        name: 'crmSources',
        component: CrmSources,
    },
    {
        path: '/entity/list',
        name: 'entityList',
        component: EntityList,
    },
    {
        path: '/entity/:entityId/list',
        name: 'entityItemList',
        component: EntityItemList,
    },
    {
        path: '/entity/:entityId/properties',
        name: 'entityProperties',
        component: EntityProperties,
    },
    {
        path: '/entity/:entityId/properties/add',
        name: 'entityPropertyAdd',
        component: EntityPropertyAdd,
    },
    {
        path: '/entity/:entityId/rights',
        name: 'entityRights',
        component: EntityRights,
    },
    {
        path: '/entity/:entityId/rights/add',
        name: 'entityRightsAdd',
        component: EntityRightsAdd,
    },
    {
        path: '/entity/add',
        name: 'entityAdd',
        component: EntityAdd,
    },
    {
        path: '/event/list',
        name: 'eventList',
        component: EventList,
    },
    {
        path: '/placement/list',
        name: 'placementList',
        component: PlacementList,
    },
    {
        path: '/placement/types',
        name: 'placementTypes',
        component: PlacementTypes,
    },
]
