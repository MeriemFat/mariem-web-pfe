//import styled from 'styled-components/macro';
//import {keyframes} from 'styled-components';
//import theme from 'styled-theming';
import Select from 'react-select';
import {keyframes} from "@emotion/react";
import {styled} from "@mui/material";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const NormalizedSelect = styled(Select)`
  .select {
    &__control {
      cursor: pointer;
      transition: var(--transition);
      border: none;
      min-height: unset;
      border-radius: 4px;
      box-shadow: none;

      &--is-focused, &:hover {
        outline: none;
      }

      &--is-focused .icon {
        transform: rotate(180deg);
      }

      .icon {
        transition: .3s ease-in-out;
      }
    }

    //&__single-value {
    //  overflow: visible;
    //}

    &__menu {
      min-width: max-content;
      width: 100%;
      border-radius: 12px;
      z-index: 100;
      animation: ${fadeIn} var(--transition);

      &.close {
        animation: ${fadeIn} var(--transition) reverse;
      }

      &-list {
        max-height: 160px;
        overflow-y: auto;
        scroll-behavior: smooth;
        z-index: 100;
      }
    }
    &__option {
      cursor: pointer;
      transition: var(--transition);

      &:hover,
      &--is-focused,
      &--is-selected {
        background: transparent;
        color: var(--header);
      }
    }

    &__indicator, &__indicator-separator {
      display: none;
    }

    &__value-container {
      padding: 0;
    }
  }
`;

const BasicMultiSelect = styled(NormalizedSelect)`
  .select {
    &__control {
      background-color: transparent;
      border: 1px solid var(--border);
      padding: 0 12px;
      height: 40px;

      &--is-focused, &:hover {
        border-color: var(--highlight);
      }
    }

    &__placeholder {
      color: var(--placeholder);
    }

    //&__single-value {
    //  color: var(--text);
    //  line-height: 1;
    //}

    &__menu {
      box-shadow: var(--widget-shadow);
      background: var(--widget)};
      width: 100%;
    }
    &__multi-value {
      background-color: var(--selected-background); 
      color: var(--text); 
    }
    &__multi-value__label {
      background-color: var(--selected-background);
      color: var(--text);
    }
  }
`;

export default BasicMultiSelect