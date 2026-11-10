import { describe, expect, it, vi } from 'vitest';
import { Group, Mesh, PerspectiveCamera, PointLight } from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CINEMATIC_POSES, CINEMATIC_STAGES, createCinematicSequence, stageProgress, cinematicPose } from './cinematic-sequence';

describe('persistent cinematic sequence', () => {
  it('maps native scroll reversibly and clamps bounds', () => {
    const stops = [100, 400, 1000];
    expect(stageProgress(0, stops)).toBe(0);
    expect(stageProgress(250, stops)).toBe(.25);
    expect(stageProgress(700, stops)).toBe(.75);
    expect(stageProgress(2000, stops)).toBe(1);
    expect(stageProgress(250, stops)).toBe(.25);
    expect(stageProgress(0, [])).toBe(0);
    expect(stageProgress(101, [100, 100, 200])).toBeCloseTo(.505);
    expect(CINEMATIC_STAGES.length).toBe(CINEMATIC_POSES.length);
    expect(CINEMATIC_STAGES.at(-1)).toBe('footer');
  });

  it('assembles contiguous bays before architecture and closes without a new explosion', () => {
    expect(CINEMATIC_POSES[0].spread).toBe(0);
    expect(CINEMATIC_POSES[2].spread).toBe(1);
    expect(CINEMATIC_POSES.slice(4).every(pose => pose.spread === 0)).toBe(true);
    const stops = [0, 300, 600, 900];
    const forward = [0, 12, 288, 300, 312, 600, 900].map(scroll => stageProgress(scroll, stops));
    const reverse = [900, 600, 312, 300, 288, 12, 0].map(scroll => stageProgress(scroll, stops)).reverse();
    expect(reverse).toEqual(forward);
    const normalized = [0, .001, .1, .199, .2, .201, .5, .9, 1];
    const poses = normalized.map(cinematicPose);
    expect(normalized.slice().reverse().map(cinematicPose).reverse()).toEqual(poses);
    expect(cinematicPose(.2)).toEqual(CINEMATIC_POSES[2]);
    expect(Math.abs(cinematicPose(.20001).spread - cinematicPose(.19999).spread)).toBeLessThan(.00001);
  });

  it('owns and releases only its timeline, trigger, observers and queued refresh', () => {
    const disconnect = vi.fn();
    vi.stubGlobal('ResizeObserver', class { observe() {} disconnect = disconnect; });
    const cancel = vi.fn();
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => 12));
    vi.stubGlobal('cancelAnimationFrame', cancel);
    const kill = vi.fn();
    const timeline = { to: vi.fn(), progress: vi.fn(), kill };
    timeline.to.mockReturnValue(timeline);
    vi.spyOn(gsap, 'timeline').mockReturnValue(timeline as unknown as ReturnType<typeof gsap.timeline>);
    const triggerKill = vi.fn();
    vi.spyOn(ScrollTrigger, 'create').mockReturnValue({ kill: triggerKill, refresh: vi.fn() } as unknown as ScrollTrigger);
    const root = document.createElement('div');
    root.innerHTML = '<section id="producto"></section><footer id="footer"></footer>';
    const sheets = new Group();
    sheets.add(new Group(), new Group());
    const upper = new Mesh();
    const lower = new Mesh();
    const cleanup = createCinematicSequence(gsap, ScrollTrigger, root, new Group(), [new Mesh(), upper, lower, sheets], new PerspectiveCamera(), new PointLight());
    expect(upper.position.y).toBe(0);
    expect(lower.position.y).toBe(0);
    expect(sheets.position.y).toBe(0);
    expect(sheets.children.map(sheet => sheet.position.x)).toEqual([0, 0]);
    window.dispatchEvent(new Event('resize'));
    cleanup();
    expect(kill).toHaveBeenCalledOnce();
    expect(triggerKill).toHaveBeenCalledOnce();
    expect(disconnect).toHaveBeenCalledOnce();
    expect(cancel).toHaveBeenCalledWith(12);
    vi.restoreAllMocks(); vi.unstubAllGlobals();
  });
});
