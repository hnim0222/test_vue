import { createRouter, createWebHistory } from 'vue-router';
import ComicDetail from '@/components/Comic/Comic.vue';
import ComicList from '@/components/Comic/ListComic.vue';
import Chapter from "@/components/Comic/Chapter.vue";
import ListFilm from "@/components/Film/ListFilm.vue";
import FilmDetail from "@/components/Film/FilmDetail.vue";
import Clock from "@/components/RealTimeClock.vue";
import Ebook from '@/components/Ebook/Ebook.vue';

const routes = [
    {
        path: '/',
        name: 'clock',
        component: Clock,
    },
    {
        path: '/comic',
        name: 'comic',
        component:  ComicList,
        props: true
    },
    {
        path: '/film',
        name: 'film',
        component: ListFilm,
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
    },
    {
        path: '/film/:filmSlug',
        name: 'film-detail',
        component: FilmDetail,
        props: true
    },
    {
        path: '/ebook',
        name: 'ebook',
        component: Ebook,
        props: true
    }


];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
