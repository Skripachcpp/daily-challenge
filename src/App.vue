<template>
  <nav>
    <router-link to="/">daily challenge</router-link> |
    <router-link to="/accounting">accounting</router-link>
  </nav>
  <router-view />
</template>

<style lang="scss">
html {
  height: 100%;
  box-sizing: border-box;
}

body {
  height: 100%;
  box-sizing: border-box;
  margin: 0;
}

#app {
  height: 100%;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  padding: 8px;
}

nav {
  a {
    color: #6e6e6e;
    text-decoration: none;

    &.router-link-exact-active {
      color: #585858;
      font-weight: bold;
    }
  }
}
</style>
