<script lang="ts" module>
	import BriefcaseIcon from '@lucide/svelte/icons/briefcase';
	import MailIcon from '@lucide/svelte/icons/mail';
	import PaletteIcon from '@lucide/svelte/icons/palette';
	import Settings2Icon from '@lucide/svelte/icons/settings-2';
	import ShieldIcon from '@lucide/svelte/icons/shield';
	import UsersIcon from '@lucide/svelte/icons/users';
</script>

<script lang="ts">
	import NavMain from './navigation.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { NavGroup } from '$lib/types/sidebar';

	const nav = $derived<NavGroup[]>([
		{
			items: [
				{
					title: m.nav_set_general(),
					url: '/',
					icon: Settings2Icon,
					items: [
						{ title: m.nav_set_tags(), url: '/' },
						{ title: m.nav_set_currencies(), url: '/' },
						{ title: m.nav_set_companies(), url: '/' },
						{ title: m.nav_set_seasons(), url: '/' }
					]
				}
			]
		},
		{
			label: m.nav_set_modules(),
			items: [
				{
					title: m.sidebar_module_business(),
					url: '/',
					icon: BriefcaseIcon,
					items: [
						{ title: m.nav_set_biz_opp_states(), url: '/' },
						{ title: m.nav_set_biz_opp_types(), url: '/' },
						{ title: m.nav_set_biz_offer_states(), url: '/' },
						{ title: m.nav_set_biz_ad_states(), url: '/' },
						{ title: m.nav_set_biz_settings(), url: '/' },
						{ title: m.nav_set_biz_email_assistant(), url: '/' },
						{ title: m.nav_set_biz_contact_types(), url: '/' }
					]
				},
				{
					title: m.nav_set_fans_email(),
					url: '/',
					icon: MailIcon,
					items: [
						{ title: m.nav_set_fans_newsletter_form(), url: '/' },
						{ title: m.nav_set_fans_sending_domains(), url: '/' },
						{ title: m.nav_set_fans_domain_prefix(), url: '/' },
						{ title: m.nav_set_fans_reply_email(), url: '/' },
						{ title: m.nav_set_fans_send_frequency(), url: '/' }
					]
				},
				{
					title: m.nav_set_fans_content(),
					url: '/',
					icon: PaletteIcon,
					items: [
						{ title: m.nav_set_fans_loyalty(), url: '/' },
						{ title: m.nav_set_fans_custom_font(), url: '/' },
						{ title: m.nav_set_fans_custom_block(), url: '/' },
						{ title: m.nav_set_fans_custom_visitor_field(), url: '/' },
						{ title: m.nav_set_fans_waitlist(), url: '/' },
						{ title: m.nav_set_fans_gdpr_texts(), url: '/' }
					]
				}
			]
		},
		{
			label: m.nav_set_system(),
			items: [
				{
					title: m.nav_set_users_access(),
					url: '/',
					icon: UsersIcon,
					items: [
						{ title: m.nav_set_user_masks(), url: '/' },
						{ title: m.nav_set_user_groups(), url: '/' },
						{ title: m.nav_set_users(), url: '/' }
					]
				},
				{
					title: m.nav_set_security_logs(),
					url: '/',
					icon: ShieldIcon,
					items: [
						{ title: m.nav_set_security(), url: '/' },
						{ title: m.nav_set_logs(), url: '/settings/logs' }
					]
				}
			]
		}
	]);
</script>

{#each nav as group, i (i)}
	<NavMain label={group.label} items={group.items} />
{/each}
