const getters = {
  	tag: state => state.tags.tag,
  	theme: state => state.common.theme,  
  	homeshowtag:state => state.common.homeshowtag,    
	  isCollapse: state => state.common.isCollapse,
	  isLock: state => state.common.isLock,
	  isFullScren: state => state.common.isFullScren,
	  lockPasswd: state => state.common.lockPasswd,
	  tagList: state => state.tags.tagList,
	  tagCurrent: state => state.tags.tagCurrent,
	  tagWel: state => state.tags.tagWel,
	  access_token: state => state.user.access_token,
	  username: state => state.user.userInfo.username,
	  permissions: state => state.user.permissions,
	  companyLogo:state => state.user.companyLogo,
	  menu: state => state.user.menu,
	treeIndex:state => state.common.treeIndex,	
}
export default getters
