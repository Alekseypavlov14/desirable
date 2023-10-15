import { BaseStore, Selector } from "../shared/types"

export interface ReactStore<State, Reducers> extends BaseStore<State, Reducers> {
	useSelector: <SelectedValue>(selector: Selector<State, SelectedValue>) => SelectedValue
}
