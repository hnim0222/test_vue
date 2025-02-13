import { createRouter, createWebHistory } from 'vue-router';
import ComicDetail from '@/components/Comic/Comic.vue';
import ComicList from '@/components/Comic/ListComic.vue';
import Chapter from "@/components/Comic/Chapter.vue";

const routes = [
    {
        path: '/',
        name: 'home',
        component: ComicList,
    },
    {
        path: '/comic/:comicSlug',
        name: 'chapter',
        component: Chapter,
        props: true
    },
    {
        path: '/chapter/:comicSlug/:chapterName',
        name: 'comic-detail',
        component: ComicDetail,
        props: true
    }


];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
