<template>
  <div
    class="menu-wrapper transition"
    :class="{'px-3': !isCollapsed}"
  >
    <a-menu
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      mode="inline"
    >
      <a-menu-item-group
        v-for="group in listMenu"
        :key="group.name"
      >
        <template #title>
        <span v-if="largerThanMd">
          <ellipsis-outlined v-if="isCollapsed"/>
          <span v-else>{{ group.name }}</span>
        </span>
          <span v-else>{{ group.name }}</span>
        </template>
        <template
          v-for="menu in group.children"
          :key="menu.name"
        >
          <a-menu-item
            v-if="menu.route"
            :key="menu.route.name"
            @click="handleChangeRoute(menu.route)"
          >
            <template #icon>
              <img :src="getImageUrl(menu.icon)" alt="">
            </template>
            {{ menu.name }}
          </a-menu-item>
          <a-sub-menu v-else :key="menu.name">
            <template #icon>
              <img :src="getImageUrl(menu.icon)" alt="">
            </template>
            <template #title>
              {{ menu.name }}
            </template>
            <a-menu-item
              v-for="item in menu.children"
              :key="item.route.name"
              @click="handleChangeRoute(item.route)"
            >
              {{ item.name }}
            </a-menu-item>
          </a-sub-menu>
        </template>
      </a-menu-item-group>
    </a-menu>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {getImageUrl} from "@/utils/url";
import {useRoute, useRouter} from "vue-router";
import type {RouteRecordName, RouteRecordRaw} from "vue-router";
import {EllipsisOutlined} from "@ant-design/icons-vue";
import {breakpointsTailwind, useBreakpoints} from "@vueuse/core";

type Props = {
  isCollapsed?: boolean;
}

const props = withDefaults(
  defineProps<Props>(),
  {
    isCollapsed: false,
  }
)

const router = useRouter();
const route = useRoute();

const breakpoints = useBreakpoints(breakpointsTailwind);
const largerThanMd = breakpoints.greater('md');

type Menu = {
  name: string,
  children: Array<{
    name: string,
    icon: string,
    route?: Pick<RouteRecordRaw, 'name'>,
    children?: Array<{
      name: string,
      route: Pick<RouteRecordRaw, 'name'>
    }>
  }>
}
const listMenu = ref<Array<Menu>>([
  {
    name: 'HOME',
    children: [
      {
        name: 'Report',
        icon: 'icon-menu-report.svg',
        route: {
          name: 'report',
        }
      }
    ]
  },
  {
    name: 'MENU',
    children: [
      {
        name: 'Promo & Reminder',
        icon: 'icon-menu-promotion.svg',
        children: [
          {
            name: 'Promotion',
            route: {
              name: 'promotion',
            }
          },
          {
            name: 'Reminder',
            route: {
              name: 'reminder',
            }
          },
          {
            name: 'Birthday',
            route: {
              name: 'birthday',
            }
          },
          {
            name: 'New Client',
            route: {
              name: 'new-client',
            }
          }
        ]
      },
      {
        name: 'Staff & Service',
        icon: 'icon-menu-staff.svg',
        children: [
          {
            name: 'Staff',
            route: {
              name: 'staff',
            }
          },
          {
            name: 'Service',
            route: {
              name: 'service',
            }
          },
        ]
      },
      {
        name: 'Member & Group',
        icon: 'icon-menu-member.svg',
        children: [
          {
            name: 'Customer',
            route: {
              name: 'customer',
            }
          },
          {
            name: 'Group',
            route: {
              name: 'group',
            }
          },
        ]
      },
      {
        name: 'Reward',
        icon: 'icon-menu-reward.svg',
        route: {
          name: 'reward'
        }
      },
      {
        name: 'Review',
        icon: 'icon-menu-review.svg',
        children: [
          {
            name: 'Review List',
            route: {
              name: 'review-list'
            }
          },
          {
            name: 'Review Settings',
            route: {
              name: 'review-setting'
            }
          }
        ]
      }
    ]
  },
  {
    name: 'SETTING',
    children: [
      {
        name: 'Settings',
        icon: 'icon-menu-settings.svg',
        route: {
          name: 'settings',
        }
      }
    ]
  },
]);
const selectedKeys = ref<Array<RouteRecordName | null | undefined>>([]);
const openKeys = ref<Array<RouteRecordName | null | undefined>>([]);

const handleInitKeys = () => {
  if (!props.isCollapsed) {
    openKeys.value = listMenu.value
      .map(item => item.children)
      .flat()
      .filter(item => item?.children?.some(child => {
        return route.matched.some(_route => _route.name === child.route.name)
      }))
      .map((item => item.name));
  } else {
    openKeys.value = [];
  }
  selectedKeys.value = route.matched.map(item => item.name);
}
watch(
  route,
  handleInitKeys,
  {
    immediate: true
  })

const handleChangeRoute = (route: Pick<RouteRecordRaw, 'name'>) => {
  router.push(route);
}
</script>

<style lang="scss" scoped>
$color: var(--color-3A);
$font-size: 16px;
$icon-size: 28px;
$item-height: 46px;
$item-radius: 10px;
$item-space-x: 8px;
$padding-left: 12px;
$padding-right: 40px;
$padding-x: 12px;
$arrow-color: #AEBDCB;

$menu-item-selected-bg: var(--color-primary);
$menu-item-selected-color: #fff;

$sub-menu-item-selected-bg: var(--color-primary-lighter);
$sub-menu-item-selected-color: var(--color-primary);

.menu-wrapper {
  :deep {
    .ant-menu {
      font-size: $font-size;
    }

    .ant-menu-light.ant-menu-root.ant-menu-inline,
    .ant-menu-light.ant-menu-root.ant-menu-vertical {
      border-inline-end: 0;
    }

    .ant-menu-item-group-title {
      font-weight: 600;
      color: var(--color-3A);
      text-align: center;
    }

    .ant-menu:not(.ant-menu-inline-collapsed) .ant-menu-item-group-title {
      padding-left: $padding-left;
      text-align: left;
    }

    .ant-menu-inline .ant-menu-item,
    .ant-menu-vertical .ant-menu-item,
    .ant-menu-inline .ant-menu-submenu-title,
    .ant-menu-vertical .ant-menu-submenu-title {
      margin-inline: 0;
      width: 100%;
      border-radius: $item-radius;
    }

    .ant-menu .ant-menu-item-group .ant-menu-item-group-list .ant-menu-item,
    .ant-menu .ant-menu-item-group .ant-menu-item-group-list .ant-menu-submenu-title {
      padding-left: $padding-left !important;
      padding-right: $padding-right;
    }

    .ant-menu .ant-menu-sub.ant-menu-inline > .ant-menu-item,
    .ant-menu .ant-menu-sub.ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title {
      padding-left: $padding-left + $icon-size + $item-space-x !important;
      padding-right: $padding-left;
    }

    .ant-menu .ant-menu-item .ant-menu-item-icon,
    .ant-menu .ant-menu-submenu-title .ant-menu-item-icon {
      width: $icon-size;
      height: $icon-size;
      object-fit: contain;
      vertical-align: middle;
    }

    .ant-menu.ant-menu-inline-collapsed > .ant-menu-item,
    .ant-menu.ant-menu-inline-collapsed > .ant-menu-item-group > .ant-menu-item-group-list > .ant-menu-item,
    .ant-menu.ant-menu-inline-collapsed > .ant-menu-item-group > .ant-menu-item-group-list > .ant-menu-submenu > .ant-menu-submenu-title,
    .ant-menu.ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title {
      padding: 0 calc(50% - $icon-size / 2) !important;
    }

    .ant-menu-light.ant-menu-inline .ant-menu-sub.ant-menu-inline {
      background: inherit;
    }

    .ant-menu-sub.ant-menu-inline > .ant-menu-item,
    .ant-menu-sub.ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title {
      .ant-menu-title-content {
        &::before {
          content: '';
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 100%;
          border: 1px solid currentColor;
          margin-right: $item-space-x;
        }
      }
    }

    .ant-menu .ant-menu-item .ant-menu-item-icon + span,
    .ant-menu .ant-menu-submenu-title .ant-menu-item-icon + span,
    .ant-menu .ant-menu-item .anticon + span,
    .ant-menu .ant-menu-submenu-title .anticon + span {
      margin-inline-start: $item-space-x;
    }

    .ant-menu .ant-menu-submenu-expand-icon,
    .ant-menu .ant-menu-submenu-arrow {
      inset-inline-end: $padding-x;
    }

    .ant-menu-submenu-expand-icon, .ant-menu-submenu-arrow {
      color: $arrow-color;
    }

    .ant-menu .ant-menu-item.ant-menu-item-selected,
    .ant-menu .ant-menu-submenu.ant-menu-submenu-selected .ant-menu-submenu-title {
      color: $menu-item-selected-color;
      background-color: $menu-item-selected-bg;
      font-weight: 600;
      .ant-menu-submenu-expand-icon,
      .ant-menu-submenu-arrow {
        color: inherit;
      }
    }

    .ant-menu .ant-menu-item-only-child.ant-menu-item-selected {
      color: $sub-menu-item-selected-color;
      background-color: $sub-menu-item-selected-bg;
      font-weight: 600;
    }

    .ant-menu-inline-collapsed {
      .ant-menu-submenu-title,
      .ant-menu-item {
        border-radius: 0;
      }

      .ant-menu-submenu.ant-menu-submenu-selected .ant-menu-submenu-title,
      .ant-menu-item.ant-menu-item-selected {
        background-color: transparent;
      }

      .ant-menu-submenu .ant-menu-submenu-title,
      .ant-menu-item {
        position: relative;

        &::before {
          content: '';
          width: 8px;
          position: absolute;
          top: 0;
          bottom: 0;
          left: -8px;
          background-color: var(--color-primary);
          border-radius: 0 4px 4px 0;
          opacity: 0;
          transition: 0.2s;
        }
      }

      .ant-menu-submenu-selected .ant-menu-submenu-title,
      .ant-menu-item-selected {

        &::before {
          left: 0;
          opacity: 1;
        }
      }
    }

    .ant-menu-item,
    .ant-menu-submenu-title {
      margin-top: 0;
    }
  }
}
</style>
