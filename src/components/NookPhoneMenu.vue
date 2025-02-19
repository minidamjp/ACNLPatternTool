<template>
  <div class="nook-phone">
    <div class="nook-header">
      <div>
        <object :data="barsSvg"></object>
        <object :data="nookSvg"></object>
      </div>
      <span class="nook-time">{{ time }}</span>
      <div>
        <object :data="gpsSvg"></object>
      </div>
    </div>
    <h2>Main Menu</h2>
    <div class="nook-buttons">
        <button v-if='isOffline' @click="reload">
            Reload
        </button>
        <button v-if='!isOffline' @click="goToBrowse">
            Browse
        </button>
        <button v-if='!isOffline' @click="goToFAQ">
            FAQ
        </button>
        <button v-if='!isOffline' @click="goToChanges">
            Changelog
        </button>
        <a v-if='!isOffline' href="https://discord.gg/9rGkZNk">
            <button>
                Discord
            </button>
        </a>
        <button @click="closeMenu">
            Close Menu
        </button>
    </div>
  </div>
</template>

<script>
import nookSvg from '/assets/icons/nookphone/nook-head.svg';
import gpsSvg from '/assets/icons/nookphone/nook-gps.svg';
import barsSvg from '/assets/icons/nookphone/nook-service.svg';
import {ifOfflineVal, isOffline} from '/utils/if-env';

export default {
  name: "NookPhoneMenu",
  model: {
      prop: 'mainMenu',
      event: 'close',
  },
  data: function() {
    return {
        dateObj: new Date(),
        time: new Date().toLocaleTimeString('en-US', {hour: '2-digit', timeStyle: 'short'}),
        offlineState: ifOfflineVal('Offline', 'Online'),
        nookSvg,
        gpsSvg,
        barsSvg,
        isOffline,
    };
  },
  created() {
      const interval = setInterval(() => this.time = this.dateObj.toLocaleTimeString('en-US', {hour: '2-digit', timeStyle: 'short'}), 1000);
  },
  methods: {
    reload: function() {
      window.location.reload(true);
    },
    goToBrowse: function() {
      this.$router.push({ path: `/browse` });
    },
    goToEditor: function() {
      this.$router.push({ path: `/editor` });
    },
    goToFAQ: function() {
      this.$router.push({ path: `/faq` });
    },
    goToChanges: function() {
      this.$router.push({ path: `/changelog` });
    },
    closeMenu: function() {
        this.$emit('close', false);
    }
  }
}
</script>

<style lang="scss" scoped>
.nook-phone {
  border-radius: 45px;
  background-color: #F0ECE1;
  color: #7E7261;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 550px;
  width: 320px;
  padding: 20px 25px;
  font-weight: 800;

  h2 {
    margin: 10px 0;
    font-size: 24px;
  }
}
.nook-header {
  color: #DCD8CA;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 100%;

  object {
    height: 25px;
    width: 25px;
  }
}
.nook-buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  button {
    border: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100px;
    width: 100px;
    margin: 6px 3px 0;
  }
}
</style>
