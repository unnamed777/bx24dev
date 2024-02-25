import store from '@app/store';
import BX24 from 'lib/BX24';

export default async () => {
    const scope = await BX24.fetch('scope');
    await store.commit('setScope', scope);
}