import React from 'react';
import {
  Flex,
  useBreakpointValue,
  useColorModeValue,
  Icon,
  Tooltip,
  Link,
} from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import {
  MdDashboard,
  MdInventory,
  MdLocalShipping,
  MdOutlineModeEdit,
  MdOutlineInput,
  MdOutlineOutput,
  MdAssignment,
  MdListAlt,
  MdAddBox,
} from 'react-icons/md';

function Sidebar() {
  const bg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.200', 'gray.600');
  const color = useColorModeValue('gray.700', 'gray.200');
  const isMobile = useBreakpointValue({ base: true, md: false });
  const role = localStorage.getItem('userRole');

  return (
    <Flex
      as="aside"
      bg={bg}
      p={4}
      align="center"
      boxShadow="md"
      flexDirection={isMobile ? 'row' : 'column'}
      wrap={isMobile ? 'nowrap' : 'wrap'}
      minWidth={['100%', '70%', '25%', '15%']}
    >
      <Tooltip label="Dashboard" placement="right">
        <Link
          as={ReactRouterLink}
          to="/dashboard"
          {...linkProps(color, hoverBg)}
          mt={10}
        >
          <Icon as={MdDashboard} />
        </Link>
      </Tooltip>

      {(role === 'admin' || role === 'staff') && (
        <>
          <Tooltip label="Inventory Management" placement="right">
            <Link as={ReactRouterLink} to="/inventory" {...linkProps(color, hoverBg)}>
              <Icon as={MdInventory} />
            </Link>
          </Tooltip>

          <Tooltip label="Distribution" placement="right">
            <Link as={ReactRouterLink} to="/distribution" {...linkProps(color, hoverBg)}>
              <Icon as={MdLocalShipping} />
            </Link>
          </Tooltip>

          <Tooltip label="Inputs" placement="right">
            <Link as={ReactRouterLink} to="/inputs" {...linkProps(color, hoverBg)}>
              <Icon as={MdOutlineInput} />
            </Link>
          </Tooltip>

          <Tooltip label="Product List" placement="right">
            <Link as={ReactRouterLink} to="/productlist" {...linkProps(color, hoverBg)}>
              <Icon as={MdListAlt} />
            </Link>
          </Tooltip>

          <Tooltip label="Distribution Report" placement="right">
            <Link as={ReactRouterLink} to="/distributionreport" {...linkProps(color, hoverBg)}>
              <Icon as={MdAssignment} />
            </Link>
          </Tooltip>
        </>
      )}

      {role === 'admin' && (
        <>
          <Tooltip label="Outputs" placement="right">
            <Link as={ReactRouterLink} to="/output" {...linkProps(color, hoverBg)}>
              <Icon as={MdOutlineOutput} />
            </Link>
          </Tooltip>

          <Tooltip label="Modify Items" placement="right">
            <Link as={ReactRouterLink} to="/modifyitem" {...linkProps(color, hoverBg)}>
              <Icon as={MdOutlineModeEdit} />
            </Link>
          </Tooltip>

          <Tooltip label="Add New Item" placement="right">
            <Link as={ReactRouterLink} to="/additem" {...linkProps(color, hoverBg)}>
              <Icon as={MdAddBox} />
            </Link>
          </Tooltip>
        </>
      )}

      {role === 'volunteer' && (
        <>
          <Tooltip label="View Inventory" placement="right">
            <Link as={ReactRouterLink} to="/inventory" {...linkProps(color, hoverBg)}>
              <Icon as={MdInventory} />
            </Link>
          </Tooltip>

          <Tooltip label="My Distributions" placement="right">
            <Link as={ReactRouterLink} to="/distribution" {...linkProps(color, hoverBg)}>
              <Icon as={MdLocalShipping} />
            </Link>
          </Tooltip>
        </>
      )}
    </Flex>
  );
}

const linkProps = (color, hoverBg) => ({
  color,
  _hover: { background: hoverBg, borderRadius: 'md' },
  p: 2,
  w: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export default Sidebar;
