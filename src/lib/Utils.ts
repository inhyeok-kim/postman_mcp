export default {
	flatItems(items: any[]){
		const flatList : any[] = [];
		items.forEach((item: any) => {
			flatList.push(this.convertItem(item));
			if(item.item){
				flatList.push(...this.flatItems(item.item));
			}
		})
		return flatList;
	},
	convertItem(item : any){
		let isFolder = !!item.item;
		if(isFolder){
			return {
				id : item.id,
				name : item.name,
				uid : item.uid,
				type : "folder",
			}
		} else {
			return {
				id : item.id,
				name : item.name,
				uid : item.uid,
				type : "request"
			}
		}
	}
}