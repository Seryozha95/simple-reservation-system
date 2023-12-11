import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material"
import store from '../store/AppStore'
import { observer } from "mobx-react-lite"

const UserIdentifier = observer(() => {
  return (
    <FormControl>
      <FormLabel id="demo-radio-buttons-group-label">Choose user</FormLabel>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="1"
        name="radio-buttons-group"
        row
        onChange={(e) => store.setUserId(+e.target.value)}
      >
        <FormControlLabel value={1} control={<Radio />} checked={store.userId ===1} label="User 1" />
        <FormControlLabel value={2} control={<Radio />} checked={store.userId ===2} label="User 2" />
        <FormControlLabel value={3} control={<Radio />} checked={store.userId ===3} label="User 3" />
      </RadioGroup>
    </FormControl>
  )
})

export default UserIdentifier
