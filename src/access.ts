const allPermissionConfig = {
  system: {
    user: {
      add: 'system:user:add',
      delete: 'system:user:delete',
      update: 'system:user:update',
      list: 'system:user:list',
    },
    role: {
      add: 'system:role:add',
      delete: 'system:role:delete',
      update: 'system:role:update',
      list: 'system:role:list',
    },
    permission: {
      add: 'system:permission:add',
      delete: 'system:permission:delete',
      update: 'system:permission:update',
      list: 'system:permission:list',
    },
    dict: {
      add: 'system:dict:add',
      delete: 'system:dict:delete',
      update: 'system:dict:update',
      list: 'system:dict:list',
    },
    department: {
      add: 'system:department:add',
      delete: 'system:department:delete',
      update: 'system:department:update',
      list: 'system:department:list',
    },
  },
  icon: {
    list: 'icon:list',
    add: 'icon:add',
    update: 'icon:update',
    delete: 'icon:delete',
  },
  catalog: {
    add: 'dataManager:catalog:add',
    update: 'dataManager:catalog:update',
    delete: 'dataManager:catalog:delete',
  },
  people: {
    delete: 'dataManager:people:delete',
    add: 'dataManager:people:add',
    update: 'dataManager:people:update',
    import: 'dataManager:people:import',
  },
  dataManager: {
    anbao: {
      list: 'dataManager:anbao:list',
      delete: 'dataManager:anbao:delete',
      add: 'dataManager:anbao:add',
      update: 'dataManager:anbao:update',
      copy: 'dataManager:anbao:copy',
      paste: 'dataManager:anbao:paste',
      export: 'dataManager:anbao:exportKML',
      import: 'dataManager:anbao:importKML',
      move: 'dataManager:anbao:move',
      startEdit: "dataManager:anbao:startEdit",
      rename: "dataManager:anbao:rename"


    },
    base: {
      list: 'dataManager:base:list',
      delete: 'dataManager:base:delete',
      add: 'dataManager:base:add',
      update: 'dataManager:base:update',
      copy: 'dataManager:base:copy',
      paste: 'dataManager:base:paste',
      export: 'dataManager:base:exportKML',
      move: 'dataManager:base:move',
      import: 'dataManager:base:importKML',
      startEdit: "dataManager:base:startEdit",
      rename: "dataManager:base:rename"



    },
    floor: {
      list: 'dataManager:building:floor:list',
      delete: 'dataManager:building:floor:delete',
      add: 'dataManager:building:floor:add',
      download: 'dataManager:building:floor:download',
      update: 'dataManager:building:floor:update',
      updateall: 'dataManager:building:floor:updateall',
    },
    building: {
      list: 'dataManager:building:building:list',
      delete: 'dataManager:building:building:delete',
      add: 'dataManager:building:building:add',
      download: 'dataManager:building:building:download',
      update: 'dataManager:building:building:update',
      updateall: 'dataManager:building:building:updateall',
    },
    visualization: {
      area: {
        "update": "dataManager:visualization:area:update",
        "list": "dataManager:visualization:area:list"
      },
      ranks: {
        update: "dataManager:visualization:ranks:update",
        list: "dataManager:visualization:ranks:list",
        add: "dataManager:visualization:ranks:add",
        delete: "dataManager:visualization:ranks:delete"
      },
      duty: {
        update: "dataManager:visualization:duty:update",
        list: "dataManager:visualization:duty:list",
        add: "dataManager:visualization:duty:add",
        delete: "dataManager:visualization:duty:delete",
        import: "dataManager:visualization:duty:import",
        download: "dataManager:visualization:duty:download"
      }
    },
    poi: {
      list: 'dataManager:poi:list',
      delete: 'dataManager:poi:delete',
      add: 'dataManager:poi:add',
      update: 'dataManager:poi:update',
      updateall: 'dataManager:poi:updateall',
      import: 'dataManager:poi:import',
      download: 'dataManager:poi:download',

    },
    video: {
      list: 'dataManager:video:list',
      delete: 'dataManager:video:delete',
      add: 'dataManager:video:add',
      update: 'dataManager:video:update',
    }
  },

  monitor: {
    log: {
      delete: 'monitor:log:delete',
      list: 'monitor:log:list',
    },
    loginLogs: {
      list: 'monitor:loginLogs:list',
    },
  },
};

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: any) {
  console.log("initialState", initialState)
  const currentUser = initialState;
  debugger


  const canAdmin = currentUser && currentUser.roles.includes('admin');
  const initAuthorities = (currentUser && currentUser?.initAuthorities) || [];
  const canUser = initAuthorities?.includes(allPermissionConfig.system.user.list);
  const canRole = initAuthorities?.includes(allPermissionConfig.system.role.list);
  const canPermission = initAuthorities?.includes(allPermissionConfig.system.permission.list);
  const canDict = initAuthorities?.includes(allPermissionConfig.system.dict.list);
  const canDepartment = initAuthorities?.includes(allPermissionConfig.system.department.list);

  const canIcon = initAuthorities?.includes(allPermissionConfig.icon.list);
  const canLogs = initAuthorities?.includes(allPermissionConfig.monitor.log.list);
  const canLoginLogs = initAuthorities?.includes(allPermissionConfig.monitor.loginLogs.list);

  const canSystem = canAdmin || canUser || canRole || canDict || canPermission || canDepartment;

  const canMonitor = canAdmin || canLogs || canLoginLogs;

  const canBase = canAdmin || initAuthorities?.includes(allPermissionConfig.dataManager.base.list);
  const canBuilding = canAdmin || initAuthorities?.includes(allPermissionConfig.dataManager.building.list);
  const canFloor = canAdmin || initAuthorities?.includes(allPermissionConfig.dataManager.floor.list);
  const canArea = canAdmin || initAuthorities?.includes(allPermissionConfig.dataManager.visualization.area.list)
  const canDuty = canAdmin || initAuthorities?.includes(allPermissionConfig.dataManager.visualization.duty.list);
  const canRanks = canAdmin || initAuthorities?.includes(allPermissionConfig.dataManager.visualization.ranks.list)
  const canPoi = canAdmin || initAuthorities?.includes(allPermissionConfig.dataManager.poi.list);
  const canAnbao = canAdmin || initAuthorities?.includes(allPermissionConfig.dataManager.anbao.list);
  const canVideo = canAdmin || initAuthorities?.includes(allPermissionConfig.dataManager.video.list)

  const canBuilds = canAdmin || canBuilding || canFloor;
  const canVisualization = canAdmin || canArea || canDuty;


  // 安保目录树
  const canAnbaoCopy = canAdmin || initAuthorities?.includes(allPermissionConfig.dataManager.anbao.update) && initAuthorities?.includes(allPermissionConfig.dataManager.anbao.copy);

  const canAnbaoPaste = canAdmin || initAuthorities?.includes(allPermissionConfig.dataManager.anbao.update) && initAuthorities?.includes(allPermissionConfig.dataManager.anbao.paste);



  const canAnbaoMove = canAdmin || initAuthorities?.includes(allPermissionConfig.dataManager.anbao.update) && initAuthorities?.includes(allPermissionConfig.dataManager.anbao.move);

  const canAnbaoImportKML = canAdmin || initAuthorities?.includes(allPermissionConfig.dataManager.anbao.add) && initAuthorities?.includes(allPermissionConfig.dataManager.anbao.import);

  const canAnbaoExportKML = canAdmin || initAuthorities?.includes(allPermissionConfig.dataManager.anbao.export);

  const canAnbaoStartEdit = canAdmin || initAuthorities?.includes(allPermissionConfig.dataManager.anbao.startEdit);


  const canAnbaoAdd = canAdmin || initAuthorities?.includes(allPermissionConfig.dataManager.anbao.add);

  const canAnbaoDelete = canAdmin || initAuthorities?.includes(allPermissionConfig.dataManager.anbao.delete);

  const canAnbaoUpdate = canAdmin || initAuthorities?.includes(allPermissionConfig.dataManager.anbao.update);

  const canAnbaoRename = canAdmin || initAuthorities?.includes(allPermissionConfig.dataManager.anbao.rename);


  const canAnbaoConfig = {
    canAnbaoCopy,
    canAnbaoPaste,
    canAnbaoMove,
    canAnbaoImportKML,
    canAnbaoExportKML,
    canAnbaoStartEdit,
    canAnbaoAdd,
    canAnbaoDelete,
    canAnbaoUpdate,
    canAnbaoRename
  };


  // 基础数据目录树


  const canBaseCopy = canAdmin || initAuthorities?.includes(allPermissionConfig.dataManager.base.update) && initAuthorities?.includes(allPermissionConfig.dataManager.base.copy);

  const canBasePaste = canAdmin || initAuthorities?.includes(allPermissionConfig.dataManager.base.update) && initAuthorities?.includes(allPermissionConfig.dataManager.base.paste);


  const canBaseMove = canAdmin || initAuthorities?.includes(allPermissionConfig.dataManager.base.update) && initAuthorities?.includes(allPermissionConfig.dataManager.base.move);

  const canBaseImportKML = canAdmin || initAuthorities?.includes(allPermissionConfig.dataManager.base.add) && initAuthorities?.includes(allPermissionConfig.dataManager.base.import);

  const canBaseExportKML = canAdmin || initAuthorities?.includes(allPermissionConfig.dataManager.base.export);

  const canBaseStartEdit = canAdmin || initAuthorities?.includes(allPermissionConfig.dataManager.base.startEdit);

  const canBaseAdd = canAdmin || initAuthorities?.includes(allPermissionConfig.dataManager.base.add);

  const canBaseDelete = canAdmin || initAuthorities?.includes(allPermissionConfig.dataManager.base.delete);

  const canBaseUpdate = canAdmin || initAuthorities?.includes(allPermissionConfig.dataManager.base.update);

  const canBaseRename = canAdmin || initAuthorities?.includes(allPermissionConfig.dataManager.base.rename);


  const canBaseConfig = {
    canBaseCopy,
    canBasePaste,
    canBaseMove,
    canBaseImportKML,
    canBaseExportKML,
    canBaseStartEdit,
    canBaseUpdate,
    canBaseDelete,
    canBaseAdd,
    canBaseRename
  };

  return {
    canAdmin,
    canUser: canAdmin || canUser,
    canRole: canAdmin || canRole,
    canPermission: canAdmin || canPermission,
    canDict: canAdmin || canDict,
    canSystem,
    canDepartment: canAdmin || canDepartment,
    canMonitor,
    canIcon: canAdmin || canIcon,
    canLogs: canAdmin || canLogs,
    canLoginLogs: canAdmin || canLoginLogs,
    canBase,
    canAnbao,
    canArea,
    canBuilding,
    canFloor,
    canDuty,
    canPoi,
    canVideo,
    canBuilds,
    canVisualization,
    canRanks,
    canAnbaoConfig,
    canBaseConfig,
    canShow: (value: string) => {
      return canAdmin || initAuthorities?.includes(value);
    },
    allPermissionConfig,
  };
}
