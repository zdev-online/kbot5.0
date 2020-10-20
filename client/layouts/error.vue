<template>
    <div>
        <h1 v-if="error.statusCode === 404">Страница не найдена!</h1>
        <h1 v-if="error.statusCode === 500">Сервер заболел!</h1>
        <h1 v-else>Неизвесстная ошибка...</h1>
        <NuxtLink to="/">Главная</NuxtLink>
    </div>
</template>

<script>
export default {
    props: ['error'],
    layout: 'error'
}
</script>
