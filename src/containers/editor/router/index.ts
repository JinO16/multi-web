import EditorList from '../views/list';
import EditorDetail from '../views/detail';

const Routers = [
    {
        path: '/edit-list',
        name: 'editList',
        component: EditorList
    },
    {
        path: '/edit-detail',
        name: 'editDetail',
        component: EditorDetail
    },
];
export default Routers;
