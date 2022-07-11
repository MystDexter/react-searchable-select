import React, { useState, useRef, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import {
  ButtonBase,
  Chip,
  FormHelperText,
  Icon,
  Input,
  InputAdornment,
  makeStyles,
  Menu,
  MenuItem,
  OutlinedInput,
  Typography,
} from "@material-ui/core";
import classNames from "classnames";

const useStyles = makeStyles((theme) => ({
  outlinedRoot: {
    margin: theme.spacing(4, 0, 2),
  },
  selectedItemsContainer: {
    display: "flex",
    flex: 1,
    flexWrap: "wrap",
  },
  selectedList: {
    listStyle: "none",
    padding: theme.spacing(1, 0),
  },
  outlinedSelectedList: {
    listStyle: "none",
    padding: theme.spacing(1, 2.5),
  },
  checkBox: {
    color: theme.palette.primary.main,
  },
  chip: {
    marginRight: theme.spacing(2) / 2,
  },
  menu: {
    overflowY: "hidden !important",
  },
  optionsContainer: {
    maxHeight: 300,
    overflowY: "auto",
    overflowX: "hidden",
  },
  icon: {
    fontSize: theme.spacing(2),
  },
  input: {
    height: theme.spacing(5),
    cursor: "pointer",
  },
  inputLabel: {
    color: theme.palette.grey[600],
  },
  outlinedInput: {
    height: theme.spacing(13),
    cursor: "pointer",
  },
  outlinedInputLabel: {
    "& legend": {
      visibility: "visible",
      transform: `translate(0, -15px) scale(1)`,
      border: "none",
      color: theme.palette.grey[600],
    },
  },
  sidePadding: {
    padding: theme.spacing(0, 1),
  },
}));

export default function SearchableSelect(props) {
  const {
    selectAllText = "Select all",
    selectAllOptionValue = "-1",
    disabled = false,
    customStyles = {
      checkBox: "",
      error: "",
    },
    clearable = true,
    error = false,
    errorText = "Please select an item",
    fullWidth = true,
    multiselect = false,
    noResultText = "No results found",
    onDeleteItem = (a) => a,
    onItemClick,
    optionId = "id",
    optionLabel = "name",
    options,
    searchable = true,
    searchByValue = "name",
    searchPlaceHolder = "Search",
    selectedValues = [],
    showSelectAllButton = true,
    title = "",
    secondaryLabel,
    variant,
    icon = "expand_more",
    iconColor = "",
    iconClass = "",
  } = props;

  const [open, setOpen] = useState(false);
  const [filteredValues, setFilteredValues] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectAllOptionId, setSelectAllOptionId] = useState(optionId);

  const classes = useStyles();
  const inputRef = useRef();
  const wrapperRef = useRef();

  useEffect(() => {
    if (options && options.length > 0 && multiselect && showSelectAllButton) {
      setSelectAllOptionId(optionId);
      options.unshift({
        [selectAllOptionId]: selectAllOptionValue,
        [optionLabel]: selectAllText,
      });
    }

    const values =
      !multiselect && selectedValues.length > 1
        ? selectedValues.filter((_, i) => i === 0)
        : selectedValues.concat();

    setSelectedItems(values);
    setFilteredValues(options);
  }, [options]);

  const handleItemSelect = (item) => {
    let selected = selectedItems;
    let isAllSelected = false;
    if (multiselect) {
      if (item[selectAllOptionId] === selectAllOptionValue) {
        item = filteredValues.filter(
          (val) => val[selectAllOptionId] !== selectAllOptionValue
        );
        isAllSelected = true;
      }
      if (
        isAllSelected &&
        item.length ===
          selectedItems.filter(
            (val) => val[selectAllOptionId] !== selectAllOptionValue
          ).length
      ) {
        selected = [];
      } else if (isItemSelected(item)) {
        selected = selected.filter((val) => val[optionId] !== item[optionId]);
        populateDeletedValue(item);
      } else {
        selected = isAllSelected ? item : [...selectedItems, item];
      }
    } else {
      selected = [item];
    }
    setSelectedItems(selected);
    populateSelectedValues(selected);
    if (!multiselect) {
      handleClose();
    }
  };

  const handleClose = () => {
    setOpen(false);
    handleSearchKeyword("");
  };

  const removeAllSelectedItems = () => {
    setSelectedItems([]);
    populateSelectedValues([]);
  };

  const handleRemoveItem = (item) => {
    const filteredSelectedItems = selectedItems.filter(
      (val) => val[optionId] !== item[optionId]
    );
    setSelectedItems(filteredSelectedItems);
    populateSelectedValues(filteredSelectedItems);
    populateDeletedValue(item);
  };

  const isItemSelected = (item) => {
    if (
      item[selectAllOptionId] === selectAllOptionValue &&
      selectedItems.length ===
        options.filter((val) => val[selectAllOptionId] !== selectAllOptionValue)
          .length
    ) {
      return true;
    }
    return (
      selectedItems.filter((val) => val[optionId] === item[optionId]).length > 0
    );
  };

  const populateSelectedValues = (values) => {
    let valuesToPopulate;

    if (values && values.length === 0) {
      valuesToPopulate = [];
    } else {
      valuesToPopulate = values;
      valuesToPopulate = multiselect ? valuesToPopulate : valuesToPopulate[0];
    }
    onItemClick(valuesToPopulate);
  };

  const populateDeletedValue = (item) => {
    const deletedValue = item;
    onDeleteItem(deletedValue);
  };

  const handleSearch = (keyword) => {
    keyword = keyword ? keyword.toLowerCase() : keyword;
    let filtredResult = options.filter((val) =>
      val[searchByValue].toString().toLowerCase().includes(keyword)
    );
    const ignoreResult = options.filter(
      (val) => val[selectAllOptionId] === selectAllOptionValue
    );
    if (JSON.stringify(filtredResult) === JSON.stringify(ignoreResult)) {
      filtredResult = [];
    }
    setFilteredValues(filtredResult);
  };

  const handleSearchKeyword = (keyword) => {
    setSearchKeyword(keyword);
    handleSearch(keyword);
  };

  const searchSection = () =>
    searchable && (
      <Input
        fullWidth
        placeholder={searchPlaceHolder}
        value={searchKeyword}
        onChange={(e) => {
          handleSearchKeyword(e.target.value);
        }}
        style={{
          minWidth: wrapperRef.current
            ? wrapperRef.current.getBoundingClientRect().width
            : undefined,
          paddingLeft: 16,
        }}
        endAdornment={
          <InputAdornment position='end'>
            {searchKeyword && (
              <ButtonBase
                centerRipple
                tabIndex={-1}
                onClick={() => {
                  setSearchKeyword("");
                  handleSearchKeyword("");
                }}
              >
                <Icon className={classes.icon}>clear</Icon>
              </ButtonBase>
            )}
          </InputAdornment>
        }
      />
    );

  const optionsContainer = () => (
    <div className={classes.optionsContainer}>
      {filteredValues && filteredValues.length > 0 ? (
        filteredValues.map((val) => (
          <MenuItem
            key={val[optionId]}
            onClick={() => handleItemSelect(val)}
            style={{
              minWidth: wrapperRef.current
                ? wrapperRef.current.getBoundingClientRect().width
                : undefined,
            }}
          >
            {multiselect && (
              <Icon style={{ marginRight: 4 }}>
                {isItemSelected(val) ? (
                  <Icon
                    className={classNames(
                      classes.checkBox,
                      customStyles.checkBox
                    )}
                  >
                    check_box
                  </Icon>
                ) : (
                  <Icon
                    className={classNames(
                      classes.checkBox,
                      customStyles.checkBox
                    )}
                  >
                    check_box_outline_blank
                  </Icon>
                )}
              </Icon>
            )}
            <div className={classes.text}>
              <Typography noWrap>{val[optionLabel]}</Typography>
              {val[optionLabel] !== selectAllText ? (
                <div>
                  <Typography noWrap variant='body2' color='textSecondary'>
                    {val[secondaryLabel]}
                  </Typography>
                </div>
              ) : (
                ""
              )}
            </div>
          </MenuItem>
        ))
      ) : (
        <MenuItem>{noResultText}</MenuItem>
      )}
    </div>
  );

  const selectedItemsContainer = () => (
    <div
      className={classes.selectedItemsContainer}
      onClick={(e) => {
        e.stopPropagation();
        !disabled && setOpen(true);
      }}
      style={{
        cursor: disabled ? "" : "pointer",
        height: selectedItems && selectedItems.length > 0 ? "auto" : 24,
      }}
    >
      {selectedItems &&
        selectedItems.length > 0 &&
        selectedItems.map((item) => (
          <li
            key={item[optionId]}
            className={
              variant === "outlined"
                ? classes.outlinedSelectedList
                : classes.selectedList
            }
          >
            {multiselect ? (
              <Chip
                className={classes.chip}
                label={item[optionLabel]}
                onDelete={() => {
                  handleRemoveItem(item);
                }}
              />
            ) : (
              <span>{item[optionLabel]}</span>
            )}
          </li>
        ))}
    </div>
  );

  return (
    <div className={className} ref={wrapperRef}>
      {variant == "outlined" ? (
        <OutlinedInput
          error={error}
          inputComponent={selectedItemsContainer}
          label={title}
          fullWidth={fullWidth}
          disabled={disabled}
          readOnly
          className={[classes.outlinedInput, classes.sidePadding].join(" ")}
          inputRef={inputRef}
          notched
          classes={{
            root: classes.outlinedRoot,
            notchedOutline: classes.outlinedInputLabel,
          }}
          endAdornment={
            <InputAdornment disablePointerEvents={disabled} position='end'>
              {clearable && selectedItems && selectedItems.length > 0 && (
                <ButtonBase
                  tabIndex={-1}
                  onClick={() => {
                    removeAllSelectedItems();
                  }}
                >
                  <Icon className={classes.icon}>clear</Icon>
                </ButtonBase>
              )}

              <ButtonBase
                centerRipple
                tabIndex={-1}
                onClick={() => {
                  setOpen(true);
                }}
              >
                <Icon color={iconColor} className={iconClass}>
                  {icon}
                </Icon>
              </ButtonBase>
            </InputAdornment>
          }
        />
      ) : (
        <Fragment>
          <Typography variant='caption' className={classes.inputLabel}>
            {title}
          </Typography>
          <Input
            error={error}
            inputComponent={selectedItemsContainer}
            fullWidth={fullWidth}
            disabled={disabled}
            readOnly
            className={classes.input}
            inputRef={inputRef}
            endAdornment={
              <InputAdornment disablePointerEvents={disabled} position='end'>
                {clearable && selectedItems && selectedItems.length > 0 && (
                  <ButtonBase
                    tabIndex={-1}
                    onClick={() => {
                      removeAllSelectedItems();
                    }}
                  >
                    <Icon className={classes.icon}>clear</Icon>
                  </ButtonBase>
                )}

                <ButtonBase
                  centerRipple
                  tabIndex={-1}
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  <Icon color={iconColor} className={iconClass}>
                    {icon}
                  </Icon>
                </ButtonBase>
              </InputAdornment>
            }
          />
        </Fragment>
      )}

      {error && errorText && (
        <FormHelperText className={customStyles.error} error={error}>
          {errorText}
        </FormHelperText>
      )}
      {open && (
        <Menu
          anchorEl={wrapperRef.current}
          keepMounted
          open
          variant='menu'
          PopoverClasses={{
            paper: classes.menu,
          }}
          style={{
            overflowY: "hidden !important",
          }}
          onClose={() => {
            handleClose();
          }}
        >
          <span>
            {searchSection()}
            {optionsContainer()}
          </span>
        </Menu>
      )}
    </div>
  );
}

SearchableSelect.propTypes = {
  selectAllText: PropTypes.string,
  selectAllOptionValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  errorText: PropTypes.string,
  fullWidth: PropTypes.bool,
  itemValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  multiselect: PropTypes.bool,
  noResultText: PropTypes.string,
  onDeleteItem: PropTypes.func,
  onItemClick: PropTypes.func.isRequired,
  optionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  optionLabel: PropTypes.string,
  options: PropTypes.array.isRequired,
  searchable: PropTypes.bool,
  searchByValue: PropTypes.string,
  searchPlaceHolder: PropTypes.string,
  selectedValues: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  clearable: PropTypes.bool,
  showSelectAllButton: PropTypes.bool,
  title: PropTypes.string,
  secondaryLabel: PropTypes.string,
  customStyles: PropTypes.shape({
    error: PropTypes.string,
    checkBox: PropTypes.string,
  }),
  variant: PropTypes.string,
  icon: PropTypes.string,
  iconColor: PropTypes.string,
  iconClass: PropTypes.string,
};
