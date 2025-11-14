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
  MdListAlt,
  MdAddBox,
} from 'react-icons/md';

function Sidebar() {
  const bg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.200', 'gray.600');
  const color = useColorModeValue('gray.700', 'gray.200');
  const isMobile = useBreakpointValue({ base: true, md: false });

  const role = localStorage.getItem('role');

  // Role-based menu items
  const menuItems = [
    {
      label: 'Dashboard',
      icon: MdDashboard,
      to: '/dashboard',
      roles: ['admin', 'staff', 'volunteer'],
    },
    {
      label: 'View Inventory',
      icon: MdInventory,
      to: '/inventory',
      roles: ['admin', 'staff', 'volunteer'],
    },
    {
      label: 'Distribution',
      icon: MdLocalShipping,
      to: '/distribution',
      roles: ['admin', 'staff'], // volunteer only view inside distribution page if you want
    },
    {
      label: 'Inputs (Receiving Stock)',
      icon: MdOutlineInput,
      to: '/inputs',
      roles: ['admin', 'staff'],
    },
    {
      label: 'Outputs',
      icon: MdOutlineOutput,
      to: '/output',
      roles: ['admin'],
    },
    {
      label: 'Product List',
      icon: MdListAlt,
      to: '/productlist',
      roles: ['admin', 'staff'],
    },
    {
      label: 'Modify Items',
      icon: MdOutlineModeEdit,
      to: '/modifyitem',
      roles: ['admin', 'staff'], // allow staff to update stock
    },
    {
      label: 'Add New Item',
      icon: MdAddBox,
      to: '/additem',
      roles: ['admin', 'staff'], // only admin+staff can add items
    },
  ];

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
      {menuItems
        .filter(item => item.roles.includes(role))
        .map(({ label, icon, to }) => (
          <Tooltip key={label} label={label} placement="right">
            <Link
              as={ReactRouterLink}
              to={to}
              {...linkProps(color, hoverBg)}
              mt={label === 'Dashboard' ? 10 : 0}
            >
              <Icon as={icon} />
            </Link>
          </Tooltip>
        ))}
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
