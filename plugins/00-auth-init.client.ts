export default defineNuxtPlugin(() => {
  useAuth().restoreSession();
});
