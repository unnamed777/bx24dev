import IndexPage from 'components/IndexPage';
import CrmDealList from 'components/modules/Crm/DealList.vue';
import CrmDealFields from 'components/modules/Crm/DealFields.vue';
import CrmDealStages from 'components/modules/Crm/DealStages.vue';
import CrmLeadList from 'components/modules/Crm/LeadList.vue';
import CrmLeadFields from 'components/modules/Crm/LeadFields.vue';
import CrmLeadStatuses from 'components/modules/Crm/LeadStatuses.vue';
import CrmStatusTypes from 'components/modules/Crm/StatusTypes.vue';
import CrmSources from 'components/modules/Crm/Sources.vue';
import EntityList from 'components/EntityList.vue';
import EntityProperties from 'components/modules/Entity/Properties.vue';
import EntityRights from 'components/modules/Entity/Rights.vue';

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
        path: '/entity/:entityId/list',
        name: 'entityList',
        component: EntityList,
    },
    {
        path: '/entity/:entityId/properties',
        name: 'entityProperties',
        component: EntityProperties,
    },
    {
        path: '/entity/:entityId/rights',
        name: 'entityRights',
        component: EntityRights,
    }
]
