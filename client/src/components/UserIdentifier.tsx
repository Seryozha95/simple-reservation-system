import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material"
import store from '../store/AppStore'

const UserIdentifier = () => {
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
        <FormControlLabel value={1} control={<Radio />} label="User 1" />
        <FormControlLabel value={2} control={<Radio />} label="User 2" />
        <FormControlLabel value={3} control={<Radio />} label="User 3" />
      </RadioGroup>
    </FormControl>
  )
}

export default UserIdentifier
